const Sequelize = require("sequelize");
const db = require("../index.js");

const Setting = db.define("settings", {
  time_limit: {
    type: Sequelize.TIME,
    allowNull: false
  },
  start_period: {
    type: Sequelize.STRING,
    allowNull: false
  },
  end_period: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email_order_cc: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email_supplier_cc: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email_vendor_cc: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Setting;
