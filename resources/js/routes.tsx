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
import { getDictionaries } from "./actions/dictionnary";
import { getSettingList } from "./actions/setting";
import { getSupplierList } from "./actions/supplier";
import { getCustomers } from "./actions/user";
import { setSelected } from "./actions/page";
import {
  getOrdersForCustomer,
  filterOrdersDispatch,
  addOrder,
  deleteOrders,
  editOrder
} from "./actions/order";

// Types pour les props communes
interface CommonProps {
  isLoginSuccess: boolean;
  isPending: boolean;
  isListPending: boolean;
  userLanguage: string;
  userType: string;
  userToken: string;
  selected: number;
  dictionnaryList: Array<{ tag: string; value: string; value_en: string }>;
  actions: {
    logout: typeof logout;
    getDictionaries: typeof getDictionaries;
    getSettingList: typeof getSettingList;
    getOrdersForCustomer: typeof getOrdersForCustomer;
    filterOrdersDispatch: typeof filterOrdersDispatch;
    getSupplierList: typeof getSupplierList;
    getCustomers: typeof getCustomers;
    deleteOrders: typeof deleteOrders;
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
    getDictionaries,
    getSettingList,
    getOrdersForCustomer,
    filterOrdersDispatch,
    getSupplierList,
    getCustomers,
    deleteOrders,
    editOrder,
    setSelected
  };

  const {
    login: { isLoginSuccess },
    user: { currentUser },
    list: { isPending },
    page: { selected },
    add: { isSuccess: isAddSuccess },
    edit: { isSuccess: isEditSuccess },
    delete: { isSuccess: isDeleteSuccess },
    dictionary: { list: dictionnaryList },
    supplier: { list: suppliers },
    menu: { list: menus },
    category: { list: categories },
    allergy: { list: allergies }
  } = useSelector((state: RootState) => state);

  const userLanguage = currentUser?.language || "";
  const userType = currentUser?.type || "";
  const userToken = currentUser?.token || "";
  const userValidity = currentUser?.validity || "";
  const userSupplierId = currentUser?.supplier_id || 0;
  const userId = currentUser?.id || 0;

  // Convertir le dictionnaire au format attendu
  const formattedDictionnaryList = dictionnaryList.map(dict => ({
    tag: dict.name,
    value: dict.value,
    value_en: dict.language === "en" ? dict.value : ""
  }));

  const commonProps = {
    isLoginSuccess,
    isPending,
    isListPending: isPending,
    userLanguage,
    userType,
    userToken,
    selected,
    dictionnaryList: formattedDictionnaryList,
    actions,
    isEditSuccess,
    isDeleteSuccess,
    isAddSuccess,
    userValidity
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<App />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/menus"
        element={
          <Menus
            {...commonProps}
            supplierList={suppliers}
            categoryList={categories}
            menuList={menus}
            cartList={[]}
            orderListTotalCount={0}
            match={{ params }}
          />
        }
      />
      <Route
        path="/cart"
        element={
          <Cart
            {...commonProps}
            cartList={[]}
            orderListTotalCount={0}
            settingList={[]}
            userId={userId}
            serverTime="0"
            is_away={false}
          />
        }
      />
      <Route
        path="/orders"
        element={
          <Orders
            {...commonProps}
            cartList={[]}
            orderListTotalCount={0}
            userSupplierId={userSupplierId}
            supplierList={suppliers}
            settingList={[]}
            userList={[]}
            orderList={[]}
            orderExtraList={[]}
          />
        }
      />
      <Route
        path="/orders/:id"
        element={
          <Orders
            {...commonProps}
            cartList={[]}
            orderListTotalCount={0}
            userSupplierId={userSupplierId}
            supplierList={suppliers}
            settingList={[]}
            userList={[]}
            orderList={[]}
            orderExtraList={[]}
          />
        }
      />
      <Route
        path="/manage-settings"
        element={
          <ManageSettings
            {...commonProps}
            settingList={[]}
            dailyMailList={[]}
          />
        }
      />
      <Route
        path="/manage-users"
        element={
          <ManageUsers
            {...commonProps}
            userId={userId}
            supplierList={suppliers}
            userList={[]}
          />
        }
      />
      <Route
        path="/manage-suppliers"
        element={
          <ManageSuppliers
            {...commonProps}
            supplierList={suppliers}
          />
        }
      />
      <Route
        path="/manage-menu-sizes"
        element={
          <ManageMenuSizes
            {...commonProps}
            menuList={menus}
            menuSizeList={[]}
          />
        }
      />
      <Route
        path="/manage-categories"
        element={
          <ManageCategories
            {...commonProps}
            supplierList={suppliers}
            categoryList={categories}
            menuList={menus}
          />
        }
      />
      <Route
        path="/manage-allergies"
        element={
          <ManageAllergies
            {...commonProps}
            allergyList={allergies}
          />
        }
      />
      <Route
        path="/manage-extras"
        element={
          <ManageExtras
            {...commonProps}
            extraList={[]}
            supplierList={suppliers}
            menuSizeList={[]}
          />
        }
      />
      <Route
        path="/menus-carried-away"
        element={
          <MenusCarriedAway
            {...commonProps}
            orderList={[]}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
