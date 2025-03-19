import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore, Middleware } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { createLogger } from "redux-logger";
import AppRoutes from "./routes";
import reducers from "./reducers";
import "./css/index.css";
import * as serviceWorker from "./serviceWorker";
import { RootAction, RootState, AppDispatch } from "./types/redux";

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

// Configuration des middlewares
const middlewares: Middleware[] = [thunk];
if (process.env.NODE_ENV !== "production") {
  middlewares.push(createLogger());
}

// Configuration du store Redux
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares)
});

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
  
  (store.dispatch as AppDispatch)(setLoginSuccess(true));
  (store.dispatch as AppDispatch)(setUserId(id));
  (store.dispatch as AppDispatch)(setUserFirstName(firstName));
  (store.dispatch as AppDispatch)(setUserLastName(lastName));
  (store.dispatch as AppDispatch)(setUserLanguage(language));
  (store.dispatch as AppDispatch)(setUserType(type));
  (store.dispatch as AppDispatch)(setUserSupplierId(supplierId));
  (store.dispatch as AppDispatch)(setUserEmailAddress(emailAddress));
  (store.dispatch as AppDispatch)(setUserPassword(password));
  (store.dispatch as AppDispatch)(setUserToken(token));
}

const cartList = localStorage.getItem("cartList");
if (cartList) {
  (store.dispatch as AppDispatch)(setCartList(JSON.parse(cartList)));
}

const selected = localStorage.getItem("selected");
if (selected) {
  (store.dispatch as AppDispatch)(setSelected(parseInt(selected)));
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
