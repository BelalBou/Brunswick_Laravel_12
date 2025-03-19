import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import add from "./add";
import allergy from "./allergy";
import cart from "./cart";
import category from "./category";
import dailyMail from "./daily_mail";
import _delete from "./delete";
import dictionnary from "./dictionnary";
import edit from "./edit";
import extra from "./extra";
import list from "./list";
import login from "./login";
import menuSize from "./menu_size";
import menu from "./menu";
import order from "./order";
import page from "./page";
import server_time from "./server_time";
import setting from "./setting";
import supplier from "./supplier";
import user from "./user";

const Reducers = combineReducers({
  add,
  allergy,
  cart,
  category,
  dailyMail,
  delete: _delete,
  dictionnary,
  edit,
  extra,
  list,
  login,
  menuSize,
  menu,
  order,
  page,
  server_time,
  setting,
  supplier,
  user,
  routing: routerReducer
});

export default Reducers;
