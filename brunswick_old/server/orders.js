const router = require("express").Router();
const moment = require("moment");
const db = require("../db");
const Order = require("../db/models/order");
const Menu = require("../db/models/menu");
const User = require("../db/models/user");
const OrderMenu = require("../db/models/order_menu");
const Supplier = require("../db/models/supplier");
const Setting = require("../db/models/setting");
const MenuSize = require("../db/models/menu_size");
const Extra = require("../db/models/extra");
const ExtraMenuOrder = require("../db/models/extra_menu_order");
const jwtUtils = require("./jwt_utils");
const sendConfirmMail = require("./utils").sendConfirmMail;

// functions

async function getList(whereObj, limit = null, offset = null) {
  const result = await Order.findAll({
    where: whereObj,
    order: [["date", "DESC"], ["id", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: User,
        as: "User",
        where: {
          deleted: false
        },
        attributes: {
          exclude: ["created_at", "updated_at", "deleted", "password"]
        }
      },
      {
        model: Menu,
        as: "Menu",
        where: {
          deleted: false
        },
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        },
        include: [
          {
            model: MenuSize,
            as: "MenuSize",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          },
          {
            model: Supplier,
            as: "Supplier",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          }

        ],
        order: [["title", "ASC"], ["MenuSize", "title", "ASC"]]
      }
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "deleted"]
    }
  });
  return result;
}

async function getListDate(date, whereObj, limit = null, offset = null) {
  const result = await Order.findAll({
    where: {
      date: {
        $eq: moment(date).format("YYYY-MM-DD")
      },
      deleted: false
    },
    order: [["date", "DESC"], ["id", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: User,
        as: "User",
        where: {
          deleted: false
        },
        attributes: {
          exclude: ["created_at", "updated_at", "deleted", "password"]
        }
      },
      {
        model: Menu,
        duplicating: false,
        as: "Menu",
        where: {
          deleted: false
        },
        include: [
          {
            model: Supplier,
            as: "Supplier",
            where: whereObj,
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          },
          {
            model: MenuSize,
            as: "MenuSize",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          }
        ],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        },
        order: [["title", "ASC"]]
      }
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "deleted"]
    }
  });
  return result;
}

async function getListCustomer(userId, limit = null, offset = null) {
  const result = await Order.findAll({
    where: {
      user_id: userId,
      deleted: false
    },
    order: [["date", "DESC"], ["id", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: User,
        as: "User",
        attributes: {
          exclude: ["created_at", "updated_at", "deleted", "password"]
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
            model: MenuSize,
            as: "MenuSize",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          }
        ],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        },
        order: [["title", "ASC"], ["MenuSize", "title", "ASC"]]
      }
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "deleted"]
    }
  });
  return result;
}

async function getListSupplier(whereObj, id, limit = null, offset = null) {
  const result = await Order.findAll({
    where: whereObj,
    order: [["date", "DESC"], ["id", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: User,
        as: "User",
        where: {
          deleted: false
        },
        attributes: {
          exclude: ["created_at", "updated_at", "deleted", "password"]
        }
      },
      {
        model: Menu,
        duplicating: false,
        as: "Menu",
        where: {
          deleted: false
        },
        include: [
          {
            model: Supplier,
            as: "Supplier",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            },
            where: {
              id
            }
          },
          {
            model: MenuSize,
            as: "MenuSize",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          }
        ],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        },
        order: [["title", "ASC"], ["MenuSize", "title", "ASC"]]
      }
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "deleted"]
    }
  });
  return result;
}

async function getListSuppliers(ids, limit = null, offset = null) {
  const result = await Order.findAll({
    where: {
      deleted: false
    },
    order: [["date", "DESC"], ["id", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: User,
        as: "User",
        where: {
          deleted: false
        },
        attributes: {
          exclude: ["created_at", "updated_at", "deleted", "password"]
        }
      },
      {
        model: Menu,
        duplicating: false,
        as: "Menu",
        where: {
          deleted: false
        },
        include: [
          {
            model: Supplier,
            as: "Supplier",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            },
            where: {
              id: ids
            }
          },
          {
            model: MenuSize,
            as: "MenuSize",
            attributes: {
              exclude: ["created_at", "updated_at", "deleted"]
            }
          }
        ],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        },
        order: [["title", "ASC"], ["MenuSize", "title", "ASC"]]
      }
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "deleted"]
    }
  });
  return result;
}

async function getListCustomers(ids, limit = null, offset = null) {
  const result = await Order.findAll({
    where: {
      deleted: false
    },
    order: [["date", "DESC"], ["id", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: User,
        as: "User",
        where: {
          type: ["customer", "administrator"],
          id: ids
        },
        attributes: {
          exclude: ["created_at", "updated_at", "deleted", "password"]
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
            attributes: {
              exclude: ["created_at", "updated_at", "deleted", "password"]
            }
          }
        ],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        },
        order: [["title", "ASC"]]
      }
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "deleted"]
    }
  });
  return result;
}

// routes

router.post("/add/", async (req, res, next) => {
  let transaction;
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (
      userType !== "administrator" &&
      userType !== "customer" &&
      userType !== "vendor"
    ) {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { userId, date, menus } = req.body;
    if (
      !parseInt(userId) ||
      !moment(Date(date)).isValid() ||
      !menus ||
      menus.length === 0
    ) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    transaction = await db.transaction();

    const order = Order.build({
      user_id: userId,
      date,
      deleted: false
    });
    const result = await order.save({transaction});
    menus.map(async menu => {
      console.log("> Adding menu : "+menu.id);
      const resultMenu = await Menu.findAll({
        where: {
          id: menu.id,
          deleted: false
        }
      },{transaction});
      if (resultMenu && resultMenu.length > 0) {
        console.log(">> menu exists... OK adding it to the order detail..");
        const orderMenu = OrderMenu.build({
          order_id: result.id,
          menu_id: menu.id,
          remark: menu.remark,
          pricing: resultMenu[0].pricing,
          quantity: menu.quantity,
          date: menu.date,
          article_not_retrieved: false,
          deleted: false
        });
        const resultOrderMenu = await orderMenu.save({transaction});
        if (menu.extras && menu.extras.length > 0) {
          menu.extras.map(async extra => {
            const resultExtra = await Extra.findAll({
              where: {
                id: extra.id,
                deleted: false
              }
            },{transaction});
            if (resultExtra && resultExtra.length > 0) {
              const extraMenuOrder = ExtraMenuOrder.build({
                pricing: resultExtra[0].pricing,
                extra_id: resultExtra[0].id,
                order_menu_id: resultOrderMenu.id,
                deleted: false
              });
              await extraMenuOrder.save({transaction});
            }
          });
        }
      } else {
        console.log(">> menu does not exist! *NOT ADDED* <<");
      }
    });
    const resultUser = await User.findAll({
      where: {
        id: userId,
        deleted: false
      }
    },{transaction});
    if (!resultUser || resultUser.length === 0) {
      return res.status(400).json({ error: "wrong user" });
    }
    const resultSetting = await Setting.findAll({});
    if (!resultSetting || resultSetting.length === 0) {
      return res.status(400).json({ error: "wrong setting" });
    }
    const customerName = `${
      resultUser[0].first_name
    } ${resultUser[0].last_name.toUpperCase()}`;
    const orderObj = { menus };
    await transaction.commit();
    console.log(moment(Date(date)).format("DD/MM/YYYY"));
    sendConfirmMail(
      moment(Date(date)).format("DD/MM/YYYY"),
      resultUser[0].email_address,
      resultSetting[0].email_order_cc,
      customerName,
      orderObj,
      resultUser[0].language
    );
    res.status(200).send(result);
  } catch (e) {
    if (transaction) await transaction.rollback();
    next(e);
  }
  return "done";
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator" && userType !== "customer") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    if (!parseInt(id)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    let whereCond = { id };
    if (userType === "customer") {
      whereCond = { id, user_id: userId };
    }
    const result = await Order.update(
      {
        deleted: true
      },
      { where: whereCond }
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/list/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator" && userType !== "customer") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { todayOnly, limit, offset } = req.body;
    let whereObj = { deleted: false };
    if (todayOnly) {
      whereObj = {
        deleted: false,
        date: {
          $eq: moment().format("YYYY-MM-DD")
        }
      };
    }
    const resultUnfiltered = await getList(whereObj);
    const result = await getList(whereObj, limit || null, offset || null);
    res.status(200).send({ result, totalCount: resultUnfiltered.length });
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/list_customer/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    if (parseInt(userId) < 1) {
      return res.status(400).json({ error: "wrong token" });
    }
    const { limit, offset } = req.body;
    const resultUnfiltered = await getListCustomer(userId);
    const result = await getListCustomer(userId, limit || null, offset || null);
    res.status(200).send({ result, totalCount: resultUnfiltered.length });
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/list_supplier/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "supplier") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    const { todayOnly, limit, offset } = req.body;
    if (!id) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    let whereObj = { deleted: false };
    if (todayOnly) {
      whereObj = {
        deleted: false,
        date: {
          $eq: moment().format("YYYY-MM-DD")
        }
      };
    }
    const resultUnfiltered = await getListSupplier(whereObj, id);
    const result = await getListSupplier(
      whereObj,
      id,
      limit || null,
      offset || null
    );
    res.status(200).send({ result, totalCount: resultUnfiltered.length });
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/list_suppliers/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { ids, limit, offset } = req.body;
    if (!ids) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const resultUnfiltered = await getListSuppliers(ids);
    const result = await getListSuppliers(ids, limit || null, offset || null);
    res.status(200).send({ result, totalCount: resultUnfiltered.length });
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/list_customers/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { ids, limit, offset } = req.body;
    if (!ids) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const resultUnfiltered = await getListCustomers(ids);
    const result = await getListCustomers(ids, limit || null, offset || null);
    res.status(200).send({ result, totalCount: resultUnfiltered.length });
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/list_date/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
    const userId = jwtUtils.getUserId(headerAuth);
/*
    if (
      userType !== "administrator" &&
      userType !== "vendor" &&
      userType !== "supplier"
    ) {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { date, limit, offset } = req.body;
    if (!date || !moment(date).isValid()) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    let whereObj = {
      deleted: false
    };
    if (userType === "supplier") {
      const resultSupplier = await User.findAll({
        where: {
          id: userId,
          deleted: false
        }
      });
      if (resultSupplier && resultSupplier.length > 0) {
        whereObj = {
          id: resultSupplier[0].supplier_id,
          deleted: false
        };
      } else {
        return res.status(400).json({ error: "wrong parameters" });
      }
    }
    const resultUnfiltered = await getListDate(date, whereObj);
    const result = await getListDate(
      date,
      whereObj,
      limit || null,
      offset || null
    );
    res
      .status(200)
      .send({ result: result, totalCount: resultUnfiltered.length });
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/check_time/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
    if (userType === "") {
      return res.status(400).json({ error: "wrong token" });
    }
    moment.locale("fr");
    const currentTime = moment().add(2, 'hour');
    res.status(200).send(currentTime);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/list_extra/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType === "") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await ExtraMenuOrder.findAll({
      where: {
        deleted: false
      },
      include: [
        {
          model: Extra,
          as: "Extra",
          attributes: {
            exclude: ["created_at", "deleted", "updated_at"]
          }
        }
      ],
      attributes: {
        exclude: ["created_at", "deleted", "updated_at"]
      },
      order: [["Extra", "title", "ASC"]]
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

// Order Menus

router.put("/edit_menu/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (
      userType !== "administrator" &&
      userType !== "customer" &&
      userType !== "vendor"
    ) {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { orderId, menuId, quantity, remark } = req.body;
    if (!parseInt(orderId) || !parseInt(menuId) || !parseInt(quantity)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await OrderMenu.update(
      {
        quantity,
        remark
      },
      { where: { order_id: orderId, menu_id: menuId } }
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/delete_menu/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (
      userType !== "administrator" &&
      userType !== "customer" &&
      userType !== "vendor"
    ) {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { orderId, menuId } = req.body;
    if (!parseInt(orderId) || !parseInt(menuId)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    await OrderMenu.destroy({
      where: {
        order_id: orderId,
        menu_id: menuId
      }
    });
    res.status(200).send("done");
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/edit_article_carried_away/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator" && userType !== "vendor") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { orderId, menuId, checked } = req.body;
    if (!parseInt(orderId) || !parseInt(menuId)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await OrderMenu.update(
      {
        article_not_retrieved: checked
      },
      {
        where: {
          order_id: orderId,
          menu_id: menuId
        }
      }
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }

  return "done";
});

module.exports = router;
