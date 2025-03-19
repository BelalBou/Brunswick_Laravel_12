const Sequelize = require("sequelize");
const db = require("../index.js");

const Extra = db.define("extras", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title_en: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pricing: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = Extra;
