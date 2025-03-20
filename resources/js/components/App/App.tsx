import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";

// Composant simplifié sans directive JSX spéciale
const App = () => {
  console.log('Composant App chargé');
  
  const location = useLocation();
  const isLoginSuccess = useSelector((state: RootState) => state.login.isLoginSuccess);
  const userType = useSelector((state: RootState) => state.user.currentUser?.type);

  // Redirection basée sur le type d'utilisateur
  const getDefaultRoute = () => {
    switch (userType) {
      case "administrator":
      case "admin":
        return "/menus";
      case "supplier":
        return "/orders";
      case "customer":
        return "/menus";
      default:
        return "/login";
    }
  };

  const defaultRoute = getDefaultRoute();
  const shouldRedirect = isLoginSuccess && defaultRoute !== "/login";

  return (
    <Navigate 
      to={shouldRedirect ? defaultRoute : "/login"} 
      replace 
      state={{ from: location }}
    />
  );
};

export default App;
