import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { store } from "./store";
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

// Récupération et dispatch des données du localStorage
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

// Rendu de l'application
const rootElement = document.getElementById("root");
if (rootElement !== null) {
  // Add loaded class to prevent FOUC
  rootElement.classList.add('loaded');
  
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
