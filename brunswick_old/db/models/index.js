const User = require("./user");
const Supplier = require("./supplier");
const Order = require("./order");
const Menu = require("./menu");
const OrderMenu = require("./order_menu");
const Allergy = require("./allergy");
const AllergyMenu = require("./allergy_menu");
const Dictionnary = require("./dictionnary");
const Setting = require("./setting");
const Category = require("./category");
const DailyMail = require("./daily_mail");
const MenuSize = require("./menu_size");
const Extra = require("./extra");
const ExtraMenu = require("./extra_menu");
const ExtraMenuOrder = require("./extra_menu_order");

// User relationships

User.hasMany(Order, { as: "Order" });
User.belongsTo(Supplier, { as: "Supplier" });

// Supplier relationships

Supplier.hasMany(Menu, { as: "Menu" });
Supplier.hasMany(Extra, { as: "Extra" });

// Order relationships

Order.belongsTo(User, { as: "User" });
Order.belongsToMany(Menu, {
  through: OrderMenu,
  as: "Menu"
});

// Menu relationships

Menu.belongsTo(Supplier, { as: "Supplier" });
Menu.belongsTo(Category, { as: "Category" });
Menu.belongsToMany(Order, {
  through: OrderMenu,
  as: "Order"
});
Menu.belongsToMany(Allergy, {
  through: AllergyMenu,
  as: "Allergy"
});
Menu.belongsTo(MenuSize, { as: "MenuSize" });
Menu.belongsToMany(Extra, {
  through: ExtraMenu,
  as: "Extra"
});

// Allergy relationships

Allergy.belongsToMany(Menu, {
  through: AllergyMenu,
  as: "Menu"
});

// Category relationships

Category.hasMany(Menu, { as: "Menu" });
Category.belongsTo(Supplier, { as: "Supplier" });

// MenuSize relationships

MenuSize.hasMany(Menu, { as: "Menu" });
MenuSize.hasMany(Extra, { as: "Extra" });

// Extra relationships

Extra.belongsTo(Supplier, { as: "Supplier" });
Extra.belongsTo(MenuSize, { as: "MenuSize" });
Extra.belongsToMany(Menu, {
  through: ExtraMenu,
  as: "Menu"
});
Extra.hasMany(ExtraMenuOrder, { as: "ExtraMenuOrder" });

// ExtraMenuOrder relationships

ExtraMenuOrder.belongsTo(Extra, { as: "Extra" });
ExtraMenuOrder.belongsTo(OrderMenu, { as: "OrderMenu" });

// OrderMenu relationships

OrderMenu.hasMany(ExtraMenuOrder, { as: "ExtraMenuOrder" });

module.exports = {
  User,
  Supplier,
  Order,
  Menu,
  OrderMenu,
  Allergy,
  AllergyMenu,
  Dictionnary,
  Setting,
  Category,
  DailyMail,
  MenuSize,
  Extra,
  ExtraMenu,
  ExtraMenuOrder
};
