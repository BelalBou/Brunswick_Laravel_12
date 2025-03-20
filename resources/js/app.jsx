// Import des shims pour résoudre les problèmes de compatibilité
import "./shims";

import React from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { store } from "./store";
import "./css/index.css";
import * as serviceWorker from "./serviceWorker";

// Initialisation de l'application React
console.log('React version dans app.jsx:', React.version);

// Récupération et dispatch des données du localStorage
const user = localStorage.getItem("user");
if (user) {
  try {
    const userData = JSON.parse(user);
    
    // Importation dynamique pour éviter le problème de préambule
    import('./actions/login').then(loginModule => {
      store.dispatch(loginModule.setLoginSuccess(true));
    });
    
    import('./actions/user').then(userModule => {
      store.dispatch(userModule.setUserId(userData.id));
      store.dispatch(userModule.setUserFirstName(userData.firstName));
      store.dispatch(userModule.setUserLastName(userData.lastName));
      store.dispatch(userModule.setUserLanguage(userData.language));
      store.dispatch(userModule.setUserType(userData.type));
      store.dispatch(userModule.setUserSupplierId(userData.supplierId));
      store.dispatch(userModule.setUserEmailAddress(userData.emailAddress));
      store.dispatch(userModule.setUserPassword(userData.password));
      store.dispatch(userModule.setUserToken(userData.token));
    });
  } catch (error) {
    console.error('Erreur lors du parsing des données utilisateur:', error);
  }
}

const cartList = localStorage.getItem("cartList");
if (cartList) {
  try {
    import('./actions/cart').then(cartModule => {
      store.dispatch(cartModule.setCartList(JSON.parse(cartList)));
    });
  } catch (error) {
    console.error('Erreur lors du parsing des données du panier:', error);
  }
}

const selected = localStorage.getItem("selected");
if (selected) {
  try {
    import('./actions/page').then(pageModule => {
      store.dispatch(pageModule.setSelected(parseInt(selected)));
    });
  } catch (error) {
    console.error('Erreur lors du parsing des données de page:', error);
  }
}

// Rendu de l'application
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (rootElement !== null) {
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
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister(); 