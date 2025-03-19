const Sequelize = require("sequelize");
const db = require("../index.js");

const OrderMenu = db.define("order_menus", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  remark: {
    type: Sequelize.STRING,
    allowNull: true
  },
  pricing: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  article_not_retrieved: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = OrderMenu;
