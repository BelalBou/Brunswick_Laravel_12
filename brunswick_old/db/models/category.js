const Sequelize = require("sequelize");
const db = require("../index.js");

const Category = db.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title_en: { type: Sequelize.STRING, allowNull: false },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = Category;
