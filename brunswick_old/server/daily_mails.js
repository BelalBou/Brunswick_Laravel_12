const router = require("express").Router();
const moment = require("moment");
const _ = require("lodash");
const sequelize = require("sequelize");
const db = require("../db");
const DailyMail = require("../db/models/daily_mail");
const Setting = require("../db/models/setting");
const Supplier = require("../db/models/supplier");
const User = require("../db/models/user");
const Menu = require("../db/models/menu");
const Order = require("../db/models/order");
const MenuSize = require("../db/models/menu_size");
const Category = require("../db/models/category");
const ExtraMenuOrder = require("../db/models/extra_menu_order");
const Extra = require("../db/models/extra");
const jwtUtils = require("./jwt_utils");
const sendDailyMail = require("./utils").sendDailyMail;
const sendVendorMail = require("./utils").sendVendorMail;
const userSort = require("./utils").userSort;
const menuSort = require("./utils").menuSort;
const categorySort = require("./utils").categorySort;

moment.locale("fr");

router.get("/check/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const resultMail = await DailyMail.findAll({
      where: sequelize.and(
        sequelize.where(
          sequelize.fn("date", sequelize.col("date")),
          "=",
          moment().format("YYYY-MM-DD")
        ),
        { deleted: false }
      )
    });
    if (resultMail && resultMail.length > 0) {
      return res.status(400).json({ error: "daily mail already sent" });
    }
    const resultSetting = await Setting.findAll({});
    if (resultSetting && resultSetting.length > 0) {
      const currentPeriod = moment().weekday();
      const startPeriod = parseInt(resultSetting[0].start_period);
      const endPeriod = parseInt(resultSetting[0].end_period);
      if (startPeriod > currentPeriod || currentPeriod > endPeriod) {
        return res.status(400).json({ error: "period out of range" });
      }
      const currentDate = moment();
      const limitDateStr =
        moment().format("MM-DD-YYYY") + " " + resultSetting[0].time_limit;
      const limitDate = moment(limitDateStr, "MM-DD-YYYY HH:mm:ss").add(
        5,
        "minutes"
      );
      if (currentDate.isSameOrBefore(limitDate)) {
        return res
          .status(400)
          .json({ error: "current time before time limit" });
      }
    } else {
      return res.status(400).json({ error: "wrong setting" });
    }
    const resultSupplier = await Supplier.findAll({
      where: { deleted: false }
    });
    const resultExtraMenuOrder = await ExtraMenuOrder.findAll({
      where: {
        deleted: false
      },
      include: [
        {
          model: Extra,
          as: "Extra"
        }
      ]
    });
    let error = "";
    if (resultSupplier && resultSupplier.length > 0) {
      const vendors = [];
      Promise.all(
        resultSupplier.map(async supplier => {
          const resultOrder = await Order.findAll({
            where: {
              date: { $eq: moment().format("YYYY-MM-DD") },
              deleted: false,
              email_send: false
            },
            include: [
              {
                model: User,
                as: "User",
                where: {
                  deleted: false
                }
              },
              {
                model: Menu,
                as: "Menu",
                where: {
                  deleted: false
                },
                include: [
                  {
                    model: Supplier,
                    as: "Supplier",
                    where: {
                      id: supplier.id,
                      deleted: false
                    }
                  },
                  {
                    model: MenuSize,
                    as: "MenuSize"
                  },
                  {
                    model: Category,
                    as: "Category"
                  }
                ],
                order: [["title", "ASC"], ["MenuSize", "title", "ASC"]]
              }
            ]
          });
          if (resultOrder && resultOrder.length > 0) {
            const orders = [];
            const supplierObj = { name: supplier.name, orders: [] };
            const orderDictionnary = _.groupBy(
              resultOrder.sort(userSort),
              order => order.User.id
            );
            const vendorDictionnary = _.groupBy(
              resultOrder.sort(categorySort),
              order => order.Menu.category_id
            );
            _.map(orderDictionnary, value => {
              const orderObj = {};
              orderObj.customerName = `${value[0].User.last_name.toUpperCase()} ${
                value[0].User.first_name
              }`;
              orderObj.menus = [];
              value.map(order => {
                order.email_send = true;
                order.save().then(function() {
                  console.log('saved');
                });
                if (order.Menu && order.Menu.length > 0) {
                  order.Menu.sort(menuSort).map(menu => {
                    const menuObj = {};
                    menuObj.quantity = menu.order_menus.quantity;
                    menuObj.remark = menu.order_menus.remark;
                    menuObj.size = menu.MenuSize ? menu.MenuSize.title : "";
                    menuObj.title = menu.title;
                    menuObj.extras = resultExtraMenuOrder.filter(
                      x => x.order_menu_id === menu.order_menus.id
                    );
                    orderObj.menus.push(menuObj);
                  });
                }
              });
              orders.push(orderObj);
            });
            _.map(vendorDictionnary, value => {
              const vendorObj = {};
              vendorObj.categoryName = `${value[0].Menu[0].Category.title}`;
              vendorObj.count = 0;
              value.map(order => {
                if (order.Menu && order.Menu.length > 0) {
                  order.Menu.map(menu => {
                    vendorObj.count += parseInt(menu.order_menus.quantity);
                  });
                }
              });
              supplierObj.orders.push(vendorObj);
            });
            error = sendDailyMail(
              supplier.email_address,
              'webcafe@esi-informatique.com',
              supplier.name,
              orders
            );
            vendors.push(supplierObj);
          }
        })
      ).then(() => {
        if (vendors && vendors.length > 0) {
          sendVendorMail(resultSetting[0].email_vendor_cc,'webcafe@esi-informatique.com', vendors);
        }
      });
    } else {
      return res.status(400).json({ error: "wrong supplier" });
    }
    const dailyMail = DailyMail.build({
      date: moment().toDate(),
      sent: !error,
      error: error,
      deleted: false
    });
    const result = await dailyMail.save();
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/list/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await DailyMail.findAll({
      where: {
        deleted: false,
        sent: true
      },
      order: [["date", "DESC"]],
      attributes: {
        exclude: ["created_at", "updated_at", "deleted"]
      }
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

module.exports = router;
