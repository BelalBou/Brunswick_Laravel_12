const router = require("express").Router();
const db = require("../db");
const Extra = require("../db/models/extra");
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
    const { title, titleEn, pricing, supplierId, menuSizeId } = req.body;
    if (!title || !titleEn || !parseFloat(pricing) || !parseInt(supplierId)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const extra = Extra.build({
      title,
      title_en: titleEn,
      pricing,
      supplier_id: supplierId,
      menu_size_id: menuSizeId ? menuSizeId : null,
      deleted: false
    });
    const result = await extra.save();
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
    const { title, titleEn, pricing, supplierId, menuSizeId } = req.body;
    if (
      !parseInt(id) ||
      !title ||
      !titleEn ||
      !parseFloat(pricing) ||
      !parseInt(supplierId)
    ) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Extra.update(
      {
        title,
        title_en: titleEn,
        pricing,
        supplier_id: supplierId,
        menu_size_id: menuSizeId ? menuSizeId : null
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
    const result = await Extra.update(
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
    const result = await Extra.findAll({
      where: {
        supplier_id: id,
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
