const router = require("express").Router();
const db = require("../db");
const MenuSize = require("../db/models/menu_size");
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
    const { title, titleEn } = req.body;
    if (!title || !titleEn) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const menuSize = MenuSize.build({
      title,
      title_en: titleEn,
      deleted: false
    });
    const result = await menuSize.save();
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
    const { title, titleEn } = req.body;
    if (!parseInt(id) || !title || !titleEn) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await MenuSize.update(
      {
        title,
        title_en: titleEn
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
    const result = await MenuSize.update(
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
    if (userType === "") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await MenuSize.findAll({
      where: {
        deleted: false
      },
      order: [["title", "ASC"]],
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
