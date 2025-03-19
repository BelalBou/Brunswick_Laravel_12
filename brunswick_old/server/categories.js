const router = require("express").Router();
const db = require("../db");
const Category = require("../db/models/category");
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
    const { title, titleEn, order, supplierId } = req.body;
    if (!title || !titleEn || !order || !parseInt(supplierId)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const category = Category.build({
      title,
      title_en: titleEn,
      order,
      supplier_id: supplierId,
      deleted: false
    });
    const result = await category.save();
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
    const { title, titleEn, order, supplierId } = req.body;
    if (!parseInt(id) || !title || !order || !parseInt(supplierId)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Category.update(
      {
        title,
        title_en: titleEn,
        order,
        supplier_id: supplierId
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
    const result = await Category.update(
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
    const result = await Category.findAll({
      where: {
        deleted: false
      },
      order: [["order", "ASC"], ["title", "ASC"]],
      attributes: {
        exclude: ["created_at", "deleted", "updated_at"]
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
    const result = await Category.findAll({
      where: {
        deleted: false
      },
      order: [["order", "ASC"], ["title", "ASC"]],
      attributes: {
        exclude: ["created_at", "deleted", "updated_at"]
      }
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/list_supplier/:id", async (req, res, next) => {
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
    const result = await Category.findAll({
      where: {
        supplier_id: id,
        deleted: false
      },
      order: [["order", "ASC"], ["title", "ASC"]],
      attributes: {
        exclude: ["created_at", "deleted", "updated_at"]
      }
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

module.exports = router;
