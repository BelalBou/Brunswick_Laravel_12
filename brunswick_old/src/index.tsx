import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise";
import ICart from "./interfaces/ICart";
import Routes from "./routes";
import reducers from "./reducers";
import "./css/index.css";
import * as serviceWorker from "./serviceWorker";


import { setLoginSuccess } from "./actions/login";
import {
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken
} from "./actions/user";
import { setCartList } from "./actions/cart";
import { setSelected } from "./actions/page";

let middlewares = [thunk, promise];
if (process.env.NODE_ENV !== "production") {
  const createLogger = require("redux-logger").createLogger();
  middlewares = [...middlewares, createLogger];
}
export const store = createStore(reducers, applyMiddleware(...middlewares));

const user = localStorage.getItem("user");
if (user) {
  const {
    id,
    firstName,
    lastName,
    language,
    type,
    supplierId,
    emailAddress,
    password,
    token
  } = JSON.parse(user);
  store.dispatch(setLoginSuccess(true));
  store.dispatch(setUserId(id));
  store.dispatch(setUserFirstName(firstName));
  store.dispatch(setUserLastName(lastName));
  store.dispatch(setUserLanguage(language));
  store.dispatch(setUserType(type));
  store.dispatch(setUserSupplierId(supplierId));
  store.dispatch(setUserEmailAddress(emailAddress));
  store.dispatch(setUserPassword(password));
  store.dispatch(setUserToken(token));
}

const cartList = localStorage.getItem("cartList");
if (cartList) {
  store.dispatch(setCartList(JSON.parse(cartList)));
}

// const cartList = localStorage.getItem("cartList");
// let cartNewList:ICart[] = [];

// if (cartList) {
  
//     JSON.parse(cartList).forEach((el)=>{
//       let dateStart = new Date(el.menu.Supplier.away_start);
//       let dateEnd = new Date(el.menu.Supplier.away_end);
//       let dateDuJour = new Date();
     
//       if(dateDuJour < dateStart || dateDuJour > dateEnd)
//         cartNewList.push(el);
//     }) 
    
//     localStorage.removeItem('cartList');
//     store.dispatch(setCartList(cartNewList)); 
//     localStorage.setItem("cartList", JSON.stringify(cartNewList));    
// }

const selected = localStorage.getItem("selected");
if (selected) {
  store.dispatch(setSelected(parseInt(selected)));
}

const root = document.getElementById("root");
if (root !== null) {
  ReactDOM.render(
    <Provider store={store}>
      <Routes />
    </Provider>,
    root
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
