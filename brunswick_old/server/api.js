const api = (module.exports = require("express").Router());
const allergies = require("./allergies");
const categories = require("./categories");
const dailyMails = require("./daily_mails");
const dictionnaries = require("./dictionnaries");
const extras = require("./extras");
const menuSizes = require("./menu_sizes");
const menus = require("./menus");
const orders = require("./orders");
const settings = require("./settings");
const suppliers = require("./suppliers");
const users = require("./users");

api
  .use("/allergies", allergies)
  .use("/categories", categories)
  .use("/daily_mails", dailyMails)
  .use("/dictionnaries", dictionnaries)
  .use("/extras", extras)
  .use("/menu_sizes", menuSizes)
  .use("/menus", menus)
  .use("/orders", orders)
  .use("/settings", settings)
  .use("/suppliers", suppliers)
  .use("/users", users);
api.use(res => res.status(404).end());
