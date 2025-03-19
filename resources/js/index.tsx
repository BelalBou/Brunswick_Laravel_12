import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore, Middleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import promise from "redux-promise";
import ICart from "./interfaces/ICart";
import AppRoutes from "./routes";
import reducers from "./reducers";
import "./css/index.css";
import * as serviceWorker from "./serviceWorker";
import { RootAction, RootState } from "./types/redux";

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

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares as Middleware[])
});

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

const selected = localStorage.getItem("selected");
if (selected) {
  store.dispatch(setSelected(parseInt(selected)));
}

const root = document.getElementById("root");
if (root !== null) {
  // Add loaded class to prevent FOUC
  root.classList.add('loaded');
  
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
    root
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
