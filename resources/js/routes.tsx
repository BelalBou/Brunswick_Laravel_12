import React from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./types/redux";
import App from "./components/App/App";
import Login from "./components/Login/Login";
import Menus from "./components/Menus/Menus";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
import ManageSettings from "./components/ManageSettings/ManageSettings";
import ManageUsers from "./components/ManageUsers/ManageUsers";
import ManageSuppliers from "./components/ManageSuppliers/ManageSuppliers";
import ManageMenus from "./components/ManageMenus/ManageMenus";
import ManageMenuSizes from "./components/ManageMenuSizes/ManageMenuSizes";
import ManageCategories from "./components/ManageCategories/ManageCategories";
import ManageAllergies from "./components/ManageAllergies/ManageAllergies";
import ManageExtras from "./components/ManageExtras/ManageExtras";
import MenusCarriedAway from "./components/MenusCarriedAway/MenusCarriedAway";
import { logout } from "./actions/login";
import { getDictionnaries } from "./actions/dictionnary";
import { getSettings } from "./actions/setting";
import { getSuppliers } from "./actions/supplier";
import { getCustomers } from "./actions/user";
import { setSelected } from "./actions/page";
import {
  getOrders,
  getOrdersForCustomer,
  getOrdersForSupplier,
  getOrdersExtra,
  getOrdersForDate,
  getOrdersForSuppliers,
  getOrdersForCustomers,
  getOrdersForCustomerSpread,
  deleteOrders,
  deleteOrder,
  editOrder
} from "./actions/order";

// Types pour les props communes
interface CommonProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userLanguage: string;
  userType: string;
  userToken: string;
  selected: number;
  dictionnaryList: any[];
  actions: {
    logout: typeof logout;
    getDictionnaries: typeof getDictionnaries;
    getSettings: typeof getSettings;
    getOrders: typeof getOrders;
    getOrdersForCustomer: typeof getOrdersForCustomer;
    getOrdersForSupplier: typeof getOrdersForSupplier;
    getOrdersExtra: typeof getOrdersExtra;
    getSuppliers: typeof getSuppliers;
    getCustomers: typeof getCustomers;
    getOrdersForDate: typeof getOrdersForDate;
    getOrdersForSuppliers: typeof getOrdersForSuppliers;
    getOrdersForCustomers: typeof getOrdersForCustomers;
    getOrdersForCustomerSpread: typeof getOrdersForCustomerSpread;
    deleteOrders: typeof deleteOrders;
    deleteOrder: typeof deleteOrder;
    editOrder: typeof editOrder;
    setSelected: typeof setSelected;
  };
  isEditSuccess: boolean;
  isDeleteSuccess: boolean;
  isAddSuccess: boolean;
  userValidity: string;
}

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();

  const actions = {
    logout,
    getDictionnaries,
    getSettings,
    getOrders,
    getOrdersForCustomer,
    getOrdersForSupplier,
    getOrdersExtra,
    getSuppliers,
    getCustomers,
    getOrdersForDate,
    getOrdersForSuppliers,
    getOrdersForCustomers,
    getOrdersForCustomerSpread,
    deleteOrders,
    deleteOrder,
    editOrder,
    setSelected
  };

  const {
    isLoginSuccess,
    isListPending,
    userLanguage,
    userType,
    userSupplierId,
    selected,
    cartList,
    orderListTotalCount,
    dictionnaryList,
    supplierList,
    menuList,
    categoryList,
    allergyList,
    menuSizeList,
    extraList,
    userToken,
    userId,
    isEditSuccess,
    isDeleteSuccess,
    isAddSuccess,
    settingList,
    dailyMailList,
    userList,
    orderList,
    orderExtraList,
    serverTime,
    is_away,
    userValidity
  } = useSelector((state: RootState) => ({
    isLoginSuccess: state.login.isLoginSuccess,
    isListPending: state.list.isListPending,
    userLanguage: state.user.language,
    userType: state.user.type,
    userSupplierId: state.user.supplierId,
    selected: state.page.selected,
    cartList: state.cart.list,
    orderListTotalCount: state.list.totalCount,
    dictionnaryList: state.dictionnary.list,
    supplierList: state.list.suppliers,
    menuList: state.list.menus,
    categoryList: state.list.categories,
    allergyList: state.list.allergies,
    menuSizeList: state.list.menuSizes,
    extraList: state.list.extras,
    userToken: state.user.token,
    userId: state.user.id,
    isEditSuccess: state.edit.isEditSuccess,
    isDeleteSuccess: state.edit.isDeleteSuccess,
    isAddSuccess: state.edit.isAddSuccess,
    settingList: state.list.settings,
    dailyMailList: state.list.dailyMails,
    userList: state.list.users,
    orderList: state.list.orders,
    orderExtraList: state.list.orderExtras,
    serverTime: state.list.serverTime,
    is_away: state.list.is_away,
    userValidity: state.user.validity || "valid"
  }));

  const commonProps = {
    isLoginSuccess,
    isListPending,
    userLanguage,
    userType,
    userToken,
    selected,
    dictionnaryList,
    actions,
    isEditSuccess,
    isDeleteSuccess,
    isAddSuccess,
    userValidity
  };

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/menus"
        element={
          <Menus
            {...commonProps}
            supplierList={supplierList}
            categoryList={categoryList}
            menuList={menuList}
            cartList={cartList}
            orderListTotalCount={orderListTotalCount}
            match={{ params }}
          />
        }
      />
      <Route
        path="/cart"
        element={
          <Cart
            {...commonProps}
            cartList={cartList}
            orderListTotalCount={orderListTotalCount}
            settingList={settingList}
            userId={userId}
            serverTime={serverTime}
            is_away={is_away}
            match={{ params }}
          />
        }
      />
      <Route
        path="/orders"
        element={
          <Orders
            {...commonProps}
            cartList={cartList}
            orderListTotalCount={orderListTotalCount}
            userSupplierId={userSupplierId}
            supplierList={supplierList}
            settingList={settingList}
            userList={userList}
            orderList={orderList}
            orderExtraList={orderExtraList}
            match={{ params }}
          />
        }
      />
      <Route
        path="/orders/:id"
        element={
          <Orders
            {...commonProps}
            cartList={cartList}
            orderListTotalCount={orderListTotalCount}
            userSupplierId={userSupplierId}
            supplierList={supplierList}
            settingList={settingList}
            userList={userList}
            orderList={orderList}
            orderExtraList={orderExtraList}
            match={{ params }}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <ManageSettings
            {...commonProps}
            settingList={settingList}
            dailyMailList={dailyMailList}
          />
        }
      />
      <Route
        path="/users"
        element={
          <ManageUsers
            {...commonProps}
            userId={userId}
            supplierList={supplierList}
            userList={userList}
          />
        }
      />
      <Route
        path="/suppliers"
        element={
          <ManageSuppliers
            {...commonProps}
            supplierList={supplierList}
          />
        }
      />
      <Route
        path="/menu-sizes"
        element={
          <ManageMenuSizes
            {...commonProps}
            menuList={menuList}
            menuSizeList={menuSizeList}
          />
        }
      />
      <Route
        path="/categories"
        element={
          <ManageCategories
            {...commonProps}
            supplierList={supplierList}
            categoryList={categoryList}
            menuList={menuList}
          />
        }
      />
      <Route
        path="/allergies"
        element={
          <ManageAllergies
            {...commonProps}
            allergyList={allergyList}
          />
        }
      />
      <Route
        path="/extras"
        element={
          <ManageExtras
            {...commonProps}
            extraList={extraList}
            supplierList={supplierList}
            menuSizeList={menuSizeList}
          />
        }
      />
      <Route
        path="/menus-carried-away"
        element={
          <MenusCarriedAway
            {...commonProps}
            orderList={orderList}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
