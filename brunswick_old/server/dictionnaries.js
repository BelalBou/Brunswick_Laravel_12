const router = require("express").Router();
const db = require("../db");
const Dictionnary = require("../db/models/dictionnary");
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
    const { tag, translationFr, translationEn } = req.body;
    if (!tag || !translationFr || !translationEn) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const dictionnary = Dictionnary.build({
      tag,
      translation_fr: translationFr,
      translation_en: translationEn,
      deleted: false
    });
    const result = await dictionnary.save();
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
    const { tag, translationFr, translationEn } = req.body;
    if (!parseInt(id) || !tag || !translationFr || !translationEn) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Dictionnary.update(
      {
        tag,
        translation_fr: translationFr,
        translation_en: translationEn
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
    const result = await Dictionnary.update(
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
    const result = await Dictionnary.findAll({
      where: {
        deleted: false
      },
      order: [["tag", "ASC"]],
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

router.get("/list/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType === "") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    if (!parseInt(id)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Dictionnary.findAll({
      where: {
        deleted: false
      },
      order: [["tag", "ASC"]],
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
