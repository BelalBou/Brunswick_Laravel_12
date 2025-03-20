import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";

type UserType = "admin" | "supplier" | "customer" | null;

const App: React.FC = (): JSX.Element => {
  const location = useLocation();
  const isLoginSuccess = useSelector((state: RootState) => state.login.isLoginSuccess);
  const userType = useSelector((state: RootState) => state.user.currentUser?.type) as UserType;

  // Redirection basée sur le type d'utilisateur
  const getDefaultRoute = (): string => {
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
};

export default App;
