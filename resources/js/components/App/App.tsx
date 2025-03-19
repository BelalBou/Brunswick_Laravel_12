import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginSuccess = useSelector((state: RootState) => state.login.isLoginSuccess);
  const userType = useSelector((state: RootState) => state.user.type);

  // Redirection basée sur le type d'utilisateur
  const getDefaultRoute = (): string => {
    switch (userType) {
      case "admin":
        return "/settings";
      case "supplier":
        return "/menus";
      case "customer":
        return "/menus";
      default:
        return "/login";
    }
  };

  return (
    <Navigate 
      to={isLoginSuccess ? getDefaultRoute() : "/login"} 
      replace 
      state={{ from: location }}
    />
  );
};

export default App;
