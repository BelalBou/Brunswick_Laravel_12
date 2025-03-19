const Sequelize = require("sequelize");
const db = require("../index.js");

const Supplier = db.define("suppliers", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email_address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email_address2: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ""
  },
  email_address3: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ""
  },
  for_vendor_only: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  away_start:{
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  away_end:{
    type: Sequelize.DATEONLY,
    allowNull: true
  },
});

module.exports = Supplier;
