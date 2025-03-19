const router = require("express").Router();
const db = require("../db");
const Setting = require("../db/models/setting");
const jwtUtils = require("./jwt_utils");

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
    const {
      timeLimit,
      startPeriod,
      endPeriod,
      emailOrderCc,
      emailSupplierCc,
      emailVendorCc
    } = req.body;
    if (!parseInt(id) || !timeLimit || !emailOrderCc || !emailSupplierCc) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Setting.update(
      {
        time_limit: timeLimit,
        start_period: startPeriod,
        end_period: endPeriod,
        email_order_cc: emailOrderCc,
        email_supplier_cc: emailSupplierCc,
        email_vendor_cc: emailVendorCc
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
    const userId = jwtUtils.getUserId(headerAuth);
    if (!parseInt(userId)) {
      return res.status(400).json({ error: "wrong token" });
    }
    const result = await Setting.findAll({
      attributes: {
        exclude: ["created_at", "updated_at"]
      }
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

module.exports = router;
