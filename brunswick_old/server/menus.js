const router = require("express").Router();
const db = require("../db");
const Menu = require("../db/models/menu");
const Supplier = require("../db/models/supplier");
const Category = require("../db/models/category");
const Allergy = require("../db/models/allergy");
const AllergyMenu = require("../db/models/allergy_menu");
const MenuSize = require("../db/models/menu_size");
const Extra = require("../db/models/extra");
const ExtraMenu = require("../db/models/extra_menu");
const jwtUtils = require("./jwt_utils");
const s3Utils = require("./s3_utils");

router.post("/add/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      sizeId,
      pricing,
      supplierId,
      categoryId,
      allergyIds,
      extraIds,
      picture
    } = req.body;
    if (
      !title ||
      !titleEn ||
      !parseFloat(pricing) ||
      !parseInt(supplierId) ||
      !parseInt(categoryId)
    ) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const menu = Menu.build({
      title,
      title_en: titleEn,
      description,
      description_en: descriptionEn,
      menu_size_id: parseInt(sizeId) > 0 ? sizeId : null,
      pricing,
      supplier_id: supplierId,
      category_id: categoryId,
      picture,
      deleted: false
    });
    const result = await menu.save();
    if (allergyIds && allergyIds.length > 0) {
      allergyIds.map(async allergyId => {
        const allergyMenu = AllergyMenu.build({
          menu_id: result.id,
          allergy_id: allergyId,
          deleted: false
        });
        await allergyMenu.save();
      });
    }
    if (extraIds && extraIds.length > 0) {
      extraIds.map(async extraId => {
        const extraMenu = ExtraMenu.build({
          menu_id: result.id,
          extra_id: extraId,
          deleted: false
        });
        await extraMenu.save();
      });
    }
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/add_picture/", (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userType = jwtUtils.getUserType(headerAuth);
/*
  if (userType !== "administrator") {
    return res.status(400).json({ error: "wrong token" });
  }
*/
  const { picture } = req.files;
  if (!picture) {
    return res.status(400).json({ error: "wrong parameters" });
  }
  const ret = s3Utils.addPicture(picture);
  if (ret === "done") {
    res.status(200).send("ok");
  } else {
    return res
      .status(400)
      .json({ error: "an issue happend while trying to transfer the picture" });
  }
  return "done";
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator" && userType !== "supplier") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      sizeId,
      pricing,
      supplierId,
      categoryId,
      allergyIds,
      extraIds,
      picture
    } = req.body;
    if (
      !parseInt(id) ||
      !title ||
      !titleEn ||
      !parseFloat(pricing) ||
      !parseInt(supplierId) ||
      !parseInt(categoryId)
    ) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    let buildObj = {
      title,
      title_en: titleEn,
      description,
      description_en: descriptionEn,
      menu_size_id: parseInt(sizeId) > 0 ? sizeId : null,
      pricing,
      supplier_id: supplierId,
      category_id: categoryId
    };
    if (picture) {
      buildObj = {
        title,
        title_en: titleEn,
        description,
        description_en: descriptionEn,
        menu_size_id: parseInt(sizeId) > 0 ? sizeId : null,
        pricing,
        supplier_id: supplierId,
        category_id: categoryId,
        picture
      };
    }
    const result = await Menu.update(buildObj, { where: { id } });
    if (allergyIds && allergyIds.length > 0) {
      await AllergyMenu.destroy({
        where: {
          menu_id: id
        }
      });
      allergyIds.map(async allergyId => {
        const allergyMenu = AllergyMenu.build({
          menu_id: id,
          allergy_id: allergyId,
          deleted: false
        });
        await allergyMenu.save();
      });
    } else {
      await AllergyMenu.destroy({
        where: {
          menu_id: id
        }
      });
    }

    if (extraIds && extraIds.length > 0) {
      await ExtraMenu.destroy({
        where: {
          menu_id: id
        }
      });
      extraIds.map(async extraId => {
        const extraMenu = ExtraMenu.build({
          menu_id: id,
          extra_id: extraId,
          deleted: false
        });
        await extraMenu.save();
      });
    } else {
      await ExtraMenu.destroy({
        where: {
          menu_id: id
        }
      });
    }
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
    if (userType !== "administrator" && userType !== "supplier") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    if (!parseInt(id)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await Menu.update(
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
    const result = await Menu.findAll({
      where: {
        deleted: false
      },
      include: [
        {
          model: Supplier,
          as: "Supplier",
          where: {
            id
          },
          attributes: {
            exclude: ["created_at", "updated_at", "deleted"]
          }
        },
        {
          model: Category,
          as: "Category",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted"]
          }
        },
        {
          model: Allergy,
          as: "Allergy",
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
        },
        {
          model: Extra,
          as: "Extra",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted"]
          },
          order: [["title", "ASC"]]
        }
      ],
      order: [["title", "ASC"], ["MenuSize", "title", "ASC"]],
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

router.get("/list/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await Menu.findAll({
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
