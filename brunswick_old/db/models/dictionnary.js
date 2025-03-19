const Sequelize = require('sequelize');
const db = require('../index.js');

const Dictionnary = db.define('dictionnaries', {
  tag: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  translation_fr: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  translation_en: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Dictionnary;
