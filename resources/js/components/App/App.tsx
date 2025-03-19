import React from "react";
import { Redirect } from "react-router-dom";

interface IProps {
  isLoginSuccess: boolean;
}

const App = ({ isLoginSuccess }: IProps) => (
  <Redirect to={isLoginSuccess ? "/menus" : "/login"} />
);

export default App;
