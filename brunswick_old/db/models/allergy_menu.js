const Sequelize = require('sequelize');
const db = require('../index.js');

const AllergyMenu = db.define('allergy_menus', {
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = AllergyMenu;
