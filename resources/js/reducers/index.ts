import { combineReducers, Reducer } from "@reduxjs/toolkit";
import loginReducer from "../actions/login";
import userReducer from "../actions/user";
import cartReducer from "../actions/cart";
import pageReducer from "../actions/page";
import addReducer from "../actions/add";
import allergyReducer from "../actions/allergy";
import categoryReducer from "../actions/category";
import dailyMailReducer from "../actions/daily_mail";
import deleteReducer from "../actions/delete";
import dictionaryReducer from "../actions/dictionnary";
import editReducer from "../actions/edit";
import extraReducer from "../actions/extra";
import listReducer from "../actions/list";
import menuReducer from "../actions/menu";
import menuSizeReducer from "../actions/menu_size";
import orderReducer from "../actions/order";
import serverTimeReducer from "../actions/server_time";
import settingReducer from "../actions/setting";
import supplierReducer from "../actions/supplier";

export interface RootState {
  login: ReturnType<typeof loginReducer>;
  user: ReturnType<typeof userReducer>;
  cart: ReturnType<typeof cartReducer>;
  page: ReturnType<typeof pageReducer>;
  add: ReturnType<typeof addReducer>;
  allergy: ReturnType<typeof allergyReducer>;
  category: ReturnType<typeof categoryReducer>;
  dailyMail: ReturnType<typeof dailyMailReducer>;
  delete: ReturnType<typeof deleteReducer>;
  dictionary: ReturnType<typeof dictionaryReducer>;
  edit: ReturnType<typeof editReducer>;
  extra: ReturnType<typeof extraReducer>;
  list: ReturnType<typeof listReducer>;
  menu: ReturnType<typeof menuReducer>;
  menuSize: ReturnType<typeof menuSizeReducer>;
  order: ReturnType<typeof orderReducer>;
  serverTime: ReturnType<typeof serverTimeReducer>;
  setting: ReturnType<typeof settingReducer>;
  supplier: ReturnType<typeof supplierReducer>;
}

const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  cart: cartReducer,
  page: pageReducer,
  add: addReducer,
  allergy: allergyReducer,
  category: categoryReducer,
  dailyMail: dailyMailReducer,
  delete: deleteReducer,
  dictionary: dictionaryReducer,
  edit: editReducer,
  extra: extraReducer,
  list: listReducer,
  menu: menuReducer,
  menuSize: menuSizeReducer,
  order: orderReducer,
  serverTime: serverTimeReducer,
  setting: settingReducer,
  supplier: supplierReducer
});

export default rootReducer;
