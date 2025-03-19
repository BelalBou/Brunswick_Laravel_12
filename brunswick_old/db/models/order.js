const Sequelize = require("sequelize");
const db = require("../index.js");

const Order = db.define("orders", {
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  email_send: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Order;
