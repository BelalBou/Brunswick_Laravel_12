import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Composant optimisé pour la dernière version de React
function App() {
  console.log('Composant App.jsx chargé avec la dernière version de React');
  
  const location = useLocation();
  const isLoginSuccess = useSelector((state) => state.login.isLoginSuccess);
  const userType = useSelector((state) => state.user.currentUser?.type);

  // Redirection basée sur le type d'utilisateur
  const getDefaultRoute = () => {
    switch (userType) {
      case "admin":
        return "/settings";
      case "supplier":
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
}

export default App; 