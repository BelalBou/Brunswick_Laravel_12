const Sequelize = require("sequelize");
const db = require("../index.js");

const ExtraMenuOrder = db.define("extra_menu_orders", {
  pricing: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = ExtraMenuOrder;
