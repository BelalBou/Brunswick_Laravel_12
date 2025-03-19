import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./containers/AppContainer";
import Login from "./containers/LoginContainer";
import Menus from "./containers/MenusContainer";
import Cart from "./containers/CartContainer";
import Orders from "./containers/OrdersContainer";
import MenusCarriedAway from "./containers/MenusCarriedAwayContainer";
import ManageUsers from "./containers/ManageUsersContainer";
import ManageSuppliers from "./containers/ManageSuppliersContainer";
import ManageCategories from "./containers/ManageCategoriesContainer";
import ManageMenuSizes from "./containers/ManageMenuSizesContainer";
import ManageAllergies from "./containers/ManageAllergiesContainer";
import ManageExtras from "./containers/ManageExtrasContainer";
import ManageMenus from "./containers/ManageMenusContainer";
import ManageSettings from "./containers/ManageSettingsContainer";
import Account from "./containers/AccountContainer";

const Routes = () => (
  <MuiThemeProvider
    theme={createMuiTheme({
      palette: {
        type: "light",
        primary: {
          main: "#002856"
        }
      }
    })}
  >
    <CssBaseline />
    <Router>
      <>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/login/:id" component={Login} />
        <Route exact path="/menus" component={Menus} />
        <Route exact path="/menus/:id" component={Menus} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/cart/:id" component={Cart} />
        <Route exact path="/orders" component={Orders} />
        <Route exact path="/orders/:id" component={Orders} />
        <Route exact path="/menus-carried-away/" component={MenusCarriedAway} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/manage-users" component={ManageUsers} />
        <Route exact path="/manage-suppliers" component={ManageSuppliers} />
        <Route exact path="/manage-categories" component={ManageCategories} />
        <Route exact path="/manage-menu-sizes" component={ManageMenuSizes} />
        <Route exact path="/manage-allergies" component={ManageAllergies} />
        <Route exact path="/manage-extras" component={ManageExtras} />
        <Route exact path="/manage-menus" component={ManageMenus} />
        <Route exact path="/manage-settings" component={ManageSettings} />
      </>
    </Router>
  </MuiThemeProvider>
);

export default Routes;
