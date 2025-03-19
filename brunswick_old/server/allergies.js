const router = require("express").Router();
const db = require("../db");
const Allergy = require("../db/models/allergy");
const jwtUtils = require("./jwt_utils");

router.post("/add/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { description, descriptionEn } = req.body;
    if (!description || !descriptionEn) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const allergy = Allergy.build({
      description,
      description_en: descriptionEn,
      deleted: false
    });
    const result = await allergy.save();
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
    const { description, descriptionEn } = req.body;
    if (!parseInt(id) || !description || !descriptionEn) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Allergy.update(
      {
        description,
        description_en: descriptionEn
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
    const result = await Allergy.update(
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
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await Allergy.findAll({
      where: {
        deleted: false
      },
      order: [["description", "ASC"]],
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
