const Sequelize = require("sequelize");
const db = require("../index.js");

const Allergy = db.define("allergies", {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description_en: {
    type: Sequelize.STRING,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = Allergy;
