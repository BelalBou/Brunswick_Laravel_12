const Sequelize = require("sequelize");
const db = require("../index.js");

const Menu = db.define("menus", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title_en: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  description_en: {
    type: Sequelize.STRING,
    allowNull: true
  },
  pricing: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: true
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = Menu;
