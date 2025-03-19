const router = require("express").Router();
const emailValidator = require("email-validator");
const db = require("../db");
const User = require("../db/models/user");
const Supplier = require("../db/models/supplier");
const jwtUtils = require("./jwt_utils");
const sequelize = require("sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/add/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { name, emailAddress, emailAddress2, emailAddress3, forVendorOnly } = req.body;
    if (!name || !emailAddress) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const supplier = Supplier.build({
      name,
      email_address: emailAddress,
      email_address2: emailAddress2,
      email_address3: emailAddress3,
      for_vendor_only: forVendorOnly,
      deleted: false
    });
    const result = await supplier.save();
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    const { name, emailAddress, emailAddress2, emailAddress3, forVendorOnly, awayStart, awayEnd } = req.body;
    if (!parseInt(id) || !name || !emailValidator.validate(emailAddress) || (emailAddress2 && !emailValidator.validate(emailAddress2)) || (emailAddress3 && !emailValidator.validate(emailAddress3))) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    var date_not_hours_away_start = new Date(awayStart);
    var date_not_hours_away_end = new Date(awayEnd);
    const result = await Supplier.update(
      {
        name,
        email_address: emailAddress,
        email_address2: emailAddress2,
        email_address3: emailAddress3,
        for_vendor_only: forVendorOnly,
        away_start : date_not_hours_away_start,
        away_end : date_not_hours_away_end,

      },
      { where: { id } }
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    if (!parseInt(id)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Supplier.update(
      {
        deleted: true
      },
      { where: { id } }
    );
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
    const admin = req.query['admin'];
    var result;

/*
    if (userType === "") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    if(admin === '1'){
      result = await Supplier.findAll({
        where: {
          deleted: false
        },
        includes: [
          {
            model: User,
            as: "User"
          }
        ],
        order: [["name", "ASC"]],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        }
      });
    }
    else {
      result = await Supplier.findAll({
        where: {
          deleted: false,
          [Op.and]: [
            Sequelize.literal('now() NOT BETWEEN away_start and away_end')
          ]
        },
        includes: [
          {
            model: User,
            as: "User"
          }
        ],
        order: [["name", "ASC"]],
        attributes: {
          exclude: ["created_at", "updated_at", "deleted"]
        }
      });
    }

    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

module.exports = router;
