const Sequelize = require("sequelize");
const db = require("../index.js");

const ExtraMenu = db.define("extra_menus", {
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = ExtraMenu;
