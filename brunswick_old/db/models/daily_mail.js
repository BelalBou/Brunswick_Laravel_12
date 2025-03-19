const Sequelize = require("sequelize");
const db = require("../index.js");

const DailyMail = db.define("daily_mails", {
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  sent: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  error: {
    type: Sequelize.STRING,
    allowNull: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = DailyMail;
