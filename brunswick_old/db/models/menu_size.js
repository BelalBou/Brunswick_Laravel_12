const Sequelize = require("sequelize");
const db = require("../index.js");

const MenuSize = db.define("menu_sizes", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title_en: { type: Sequelize.STRING, allowNull: false },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = MenuSize;
