import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/en-gb";
import "moment/locale/fr";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import DetailsOrder from "../DetailsOrder/DetailsOrder";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import OrdersFilter from "../OrdersFilter/OrdersFilter";
import OrdersExport from "../OrdersExport/OrdersExport";
import OrdersList from "../OrdersList/OrdersList";
import EditCart from "../EditCart/EditCart";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ICart from "../../interfaces/ICart";
import ISupplier from "../../interfaces/ISupplier";
import IUser from "../../interfaces/IUser";
import ISetting from "../../interfaces/ISetting";
import ISelect from "../../interfaces/ISelect";
import IMenu from "../../interfaces/IMenu";
import IOrderExtra from "../../interfaces/IOrderExtra";
import IOrderInterface from "../../interfaces/IOrder";
import IOrderDisplay from "../../interfaces/IOrderDisplay";
import { RootState, AppDispatch } from "../../types/redux";
import { logout } from "../../actions/login";
import { setSelected } from "../../actions/page";
import { 
  getOrdersForCustomer,
  filterOrdersDispatch,
  addOrder,
  deleteOrders,
  editOrder
} from "../../actions/order";
import { getDictionaries } from "../../actions/dictionnary";
import { getSettingList } from "../../actions/setting";
import { getSupplierList } from "../../actions/supplier";
import getUserList from "../../actions/user";
import axios from "axios";
import {
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Box
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { AsyncThunkAction } from "@reduxjs/toolkit";

const StyledMain = styled('main')({
  flex: 1
});

const StyledLayout = styled('div')({
  width: "auto",
  margin: "0 auto"
});

const StyledCardGrid = styled('div')(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4)
  }
}));

const StyledHeroUnit = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2)
}));

const StyledSectionDesktop = styled('div')(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const StyledSectionMobile = styled('div')(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.up("md")]: {
    display: "none"
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface IProps {
  isLoginSuccess: boolean;
  isEditSuccess: boolean;
  isDeleteSuccess: boolean;
  isListPending: boolean;
  userToken: string;
  userType: string;
  userSupplierId: number;
  userLanguage: string;
  selected: number;
  dictionnaryList: any[];
  cartList: ICart[];
  orderList: IOrderInterface[];
  orderExtraList: IOrderExtra[];
  orderListTotalCount: number;
  supplierList: ISupplier[];
  userList: IUser[];
  settingList: ISetting[];
  actions: {
    logout: () => (dispatch: AppDispatch) => void;
    getDictionaries: () => AsyncThunkAction<any, void, any>;
    getSettingList: () => (dispatch: AppDispatch) => void;
    getOrders: (limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForCustomer: (limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForSupplier: (supplierId: number, todayOnly: boolean, limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersExtra: () => (dispatch: AppDispatch) => void;
    getSuppliers: () => (dispatch: AppDispatch) => void;
    getUsers: () => (dispatch: AppDispatch) => void;
    getOrdersForDate: (date: string, limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForSuppliers: (supplierIds: number[], limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForCustomers: (customerIds: number[], limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForCustomerSpread: (limit: number, offset: number) => (dispatch: AppDispatch) => void;
    filterOrdersDispatch: (limit: number, offset: number, selectedFilter: string, selectedDate: moment.Moment, selectedSupplierIds: number[], selectedCustomerIds: number[]) => (dispatch: AppDispatch) => void;
    deleteOrders: (id: number, forCustomer: boolean, limit: number, offset: number, selectedFilter: string, selectedDate: moment.Moment, selectedSupplierIds: number[], selectedCustomerIds: number[]) => (dispatch: AppDispatch) => void;
    editOrder: (orderId: number, menuId: number, quantity: number, remark: string, forCustomer: boolean, limit: number, offset: number, selectedFilter: string, selectedDate: moment.Moment, selectedSupplierIds: number[], selectedCustomerIds: number[]) => (dispatch: AppDispatch) => void;
    setSelected: (selected: number) => (dispatch: AppDispatch) => void;
  };
}

interface IState {
  openDetails: boolean;
  openDelete: boolean;
  openEdit: boolean;
  orderDeleted: boolean;
  menuDeleted: boolean;
  menuEdited: boolean;
  deleteId: number;
  editCart: ICart;
  selectedFilter: string;
  selectedDate: moment.Moment | null;
  selectedSuppliers: ISelect[];
  selectedCustomers: ISelect[];
  selectedSupplierIds: number[];
  selectedCustomerIds: number[];
  limit: number;
  offset: number;
  hasMore: boolean;
  redirectTo: string;
  detailsId: number;
}

interface IOrderMenu {
  quantity: number;
  article_not_retrieved: boolean;
}

const Orders: React.FC<IProps> = ({
  isLoginSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  userToken,
  userType,
  userSupplierId,
  userLanguage,
  selected,
  dictionnaryList,
  cartList,
  orderList,
  orderExtraList,
  orderListTotalCount,
  supplierList,
  userList,
  settingList,
  actions
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const all = params.id === "all";

  const [state, setState] = useState<IState>({
    openDetails: false,
    openDelete: false,
    openEdit: false,
    orderDeleted: false,
    menuDeleted: false,
    menuEdited: false,
    deleteId: 0,
    editCart: {} as ICart,
    selectedFilter: "",
    selectedDate: null,
    selectedSuppliers: [],
    selectedCustomers: [],
    selectedSupplierIds: [],
    selectedCustomerIds: [],
    limit: 10,
    offset: 0,
    hasMore: true,
    redirectTo: "",
    detailsId: -1
  });

  useEffect(() => {
    const timer = setInterval(tick, 60000);

    if (isLoginSuccess && userToken) {
      refresh();
    }
    if (userType === "supplier") {
      handleChangeSelected(3);
      setState(prev => ({
        ...prev,
        selectedFilter: "date"
      }));
    }
    if (userLanguage === "en") {
      moment.locale("en-gb");
    } else {
      moment.locale("fr");
    }

    return () => clearInterval(timer);
  }, [isLoginSuccess, userToken, userType, userLanguage]);

  useEffect(() => {
    if (state.hasMore && orderList.length && orderList.length === orderListTotalCount) {
      setState(prev => ({ ...prev, hasMore: false }));
    }
  }, [orderList, orderListTotalCount]);

  useEffect(() => {
    if (isLoginSuccess) {
      actions.getDictionaries();
      actions.getSettingList();
      if (userType === "customer") {
        actions.getOrdersForCustomer(10, 0);
      } else if (userType === "supplier") {
        actions.filterOrdersDispatch(10, 0, "all", moment(), [userSupplierId], []);
      } else if (userType === "administrator") {
        actions.filterOrdersDispatch(10, 0, "all", moment(), [], []);
      }
    }
  }, [isLoginSuccess, userType, userSupplierId]);

  const tick = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/users/check_validity",
        withCredentials: true
      });
      if (response.data === "not valid") {
        dispatch(actions.logout());
      }
    } catch (error) {
      console.error("Error checking validity:", error);
    }
  };

  const refresh = () => {
    const { limit, offset } = state;

    tick();
    dispatch(actions.getDictionaries());
    dispatch(actions.getSettingList());

    if (userType === "administrator") {
      if (all) {
        dispatch(actions.getOrders(limit, offset));
        dispatch(actions.getSuppliers());
        dispatch(actions.getUsers());
      } else {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      }
      dispatch(actions.getOrdersExtra());
    } else if (userType === "customer" || userType === "vendor") {
      dispatch(actions.getOrdersForCustomer(limit, offset));
      dispatch(actions.getOrdersExtra());
    } else if (userType === "supplier") {
      dispatch(actions.getOrdersForSupplier(userSupplierId, true, limit, offset));
      dispatch(actions.getOrdersExtra());
    }
  };

  const handleChangeSelected = (selected: number) => {
    dispatch(actions.setSelected(selected));
    const { limit, offset, selectedSuppliers, selectedCustomers } = state;
    
    const supplierIds = selectedSuppliers.map(supplier => supplier.value);
    const customerIds = selectedCustomers.map(customer => customer.value);
    
    if (selected === 0) {
      if (userType === "administrator") {
        dispatch(actions.getOrders(limit, offset));
      } else if (userType === "customer") {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      } else if (userType === "supplier") {
        dispatch(actions.getOrdersForSupplier(userSupplierId, false, limit, offset));
      }
      setState(prev => ({
        ...prev,
        selectedFilter: "",
        selectedDate: null,
        selectedSuppliers: [],
        selectedCustomers: [],
        selectedSupplierIds: [],
        selectedCustomerIds: []
      }));
    } else if (selected === 1) {
      if (userType === "administrator") {
        dispatch(actions.getOrdersForDate(moment().format("YYYY-MM-DD"), limit, offset));
      } else if (userType === "customer") {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      } else if (userType === "supplier") {
        dispatch(actions.getOrdersForSupplier(userSupplierId, true, limit, offset));
      }
      setState(prev => ({
        ...prev,
        selectedFilter: "date",
        selectedDate: moment()
      }));
    } else if (selected === 2) {
      if (userType === "administrator") {
        dispatch(actions.getOrdersForSuppliers(supplierIds, limit, offset));
      } else if (userType === "customer") {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      } else if (userType === "supplier") {
        dispatch(actions.getOrdersForSupplier(userSupplierId, false, limit, offset));
      }
      setState(prev => ({
        ...prev,
        selectedFilter: "suppliers"
      }));
    } else if (selected === 3) {
      if (userType === "administrator") {
        dispatch(actions.getOrdersForCustomers(customerIds, limit, offset));
      } else if (userType === "customer") {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      } else if (userType === "supplier") {
        dispatch(actions.getOrdersForSupplier(userSupplierId, false, limit, offset));
      }
      setState(prev => ({
        ...prev,
        selectedFilter: "customers"
      }));
    }
  };

  const handleLogout = () => {
    dispatch(actions.logout());
  };

  const handleCloseSnackbarMenuEdited = () => {
    setState(prev => ({
      ...prev,
      menuEdited: false
    }));
  };

  const handleCloseSnackbarMenuDeleted = () => {
    setState(prev => ({
      ...prev,
      menuDeleted: false
    }));
  };

  const handleCloseSnackbarOrderDeleted = () => {
    setState(prev => ({
      ...prev,
      orderDeleted: false
    }));
  };

  const getTranslation = (tag: string): string => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  const isOrderEditable = (date: string) => {
    if (userType === "supplier") {
      return false;
    }
    if (userType === "administrator" && all) {
      return true;
    }
    if (!date) {
      return false;
    }
    if (settingList && settingList.length > 0) {
      const orderDate =
        moment(date).format("MM-DD-YYYY") + " " + settingList[0].time_limit;
      const startDate = moment(orderDate, "MM-DD-YYYY HH:mm:ss");
      const endDate = moment();
      return startDate.isSameOrAfter(endDate);
    }
    return false;
  };

  const handleTableColumns = () => {
    switch (userType) {
      case "customer":
        return [
          {
            name: "date",
            title: "Date"
          },
          {
            name: "pricing",
            title: getTranslation("_PRIX")
          },
          {
            name: "action",
            title: "Action"
          }
        ];
      case "supplier":
        return [
          {
            name: "date",
            title: "Date"
          },
          {
            name: "client",
            title: "Client"
          },
          {
            name: "action",
            title: "Action"
          }
        ];
      case "vendor":
        return [
          {
            name: "date",
            title: "Date"
          },
          {
            name: "pricing",
            title: getTranslation("_PRIX")
          },
          {
            name: "action",
            title: "Action"
          }
        ];
      case "administrator":
        if (all) {
          return [
            {
              name: "date",
              title: "Date"
            },
            {
              name: "client",
              title: "Client"
            },
            {
              name: "pricing",
              title: getTranslation("_PRIX")
            },
            {
              name: "action",
              title: "Action"
            }
          ];
        } else {
          return [
            {
              name: "date",
              title: "Date"
            },
            {
              name: "pricing",
              title: getTranslation("_PRIX")
            },
            {
              name: "action",
              title: "Action"
            }
          ];
        }
      default:
        return [];
    }
  };

  const handleTableRows = () => {
    return orderList.map((order) => ({
      id: order.id,
      date: moment(order.date).format("DD/MM/YYYY HH:mm"),
      client: `${order.User?.first_name} ${order.User?.last_name}` || "",
      supplier: supplierList.find(s => s.id === order.User?.supplier_id)?.name || "",
      menu: order.Menu[0]?.title || "",
      quantity: order.Menu[0]?.order_menu[0]?.quantity || 0,
      price: order.Menu[0]?.pricing || 0,
      total: (order.Menu[0]?.pricing || 0) * (order.Menu[0]?.order_menu[0]?.quantity || 0),
      status: order.Menu[0]?.order_menu[0]?.article_not_retrieved ? "Non récupéré" : "Récupéré",
      actions: (
        <Box>
          {isOrderEditable(order.date) && (
            <>
              <IconButton onClick={() => handleOpenEdit(order.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleOpenDelete(order.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      )
    }));
  };

  const handleOpenDetails = (id: number) => {
    setState(prev => ({
      ...prev,
      openDetails: true,
      detailsId: id
    }));
  };

  const handleOpenDelete = (orderId: number) => {
    setState(prev => ({
      ...prev,
      openDelete: true,
      deleteId: orderId
    }));
  };

  const handleOpenEdit = (orderId: number) => {
    const order = orderList.find(o => o.id === orderId);
    if (order && order.Menu[0]) {
      const cart: ICart = {
        menu: order.Menu[0],
        quantity: order.Menu[0].order_menu[0]?.quantity || 0,
        remark: order.Menu[0].order_menu[0]?.remark || "",
        extras: []
      };
      setState(prev => ({
        ...prev,
        openEdit: true,
        editCart: cart
      }));
    }
  };

  const handleCloseDetails = () => {
    setState(prev => ({
      ...prev,
      openDetails: false
    }));
  };

  const handleCloseDelete = () => {
    setState(prev => ({
      ...prev,
      openDelete: false
    }));
  };

  const handleCloseEdit = () => {
    setState(prev => ({
      ...prev,
      openEdit: false
    }));
  };

  const handleDelete = () => {
    if (deleteId > 0) {
      dispatch(actions.deleteOrders(
        deleteId,
        userType === "customer",
        10,
        0,
        "all",
        moment(),
        [userSupplierId],
        []
      ));
    }
    setState(prev => ({
      ...prev,
      openDelete: false,
      deleteId: 0
    }));
  };

  const handleEdit = () => {
    if (editCart.menu) {
      dispatch(actions.editOrder(
        editCart.menu.id,
        editCart.menu.id,
        editCart.quantity,
        editCart.remark,
        userType === "customer",
        10,
        0,
        "all",
        moment(),
        [userSupplierId],
        []
      ));
    }
    setState(prev => ({
      ...prev,
      openEdit: false,
      editCart: {} as ICart
    }));
  };

  const handleRetrieveOrder = (): IOrderInterface | undefined => {
    const { detailsId } = state;
    return orderList.find((order: IOrderInterface) => order.id === detailsId);
  };

  const handleRetrieveOrderExtra = (menuId: number): IOrderExtra | undefined => {
    return orderExtraList.find((orderExtra: IOrderExtra) => orderExtra.order_menu_id === menuId);
  };

  const handleTableData = () => {
    const data: IOrderDisplay[] = [];
    orderList.forEach((order) => {
      const pricing = order.Menu.reduce((acc, menu) => {
        const orderExtra = handleRetrieveOrderExtra(menu.id);
        return acc + (orderExtra ? parseFloat(orderExtra.pricing) : 0);
      }, 0);

      data.push({
        id: order.id,
        date: order.date,
        client: order.User ? order.User.first_name + " " + order.User.last_name : "",
        pricing: pricing.toFixed(2) + " €",
        action: (
          <div>
            <Tooltip title={getTranslation("_VOIR_DETAILS")}>
              <StyledIconButton
                onClick={() => handleOpenDetails(order.id)}
              >
                <VisibilityIcon />
              </StyledIconButton>
            </Tooltip>
            {isOrderEditable(order.date) && (
              <Tooltip title={getTranslation("_SUPPRIMER")}>
                <StyledIconButton
                  onClick={() => handleOpenDelete(order.id)}
                >
                  <DeleteIcon />
                </StyledIconButton>
              </Tooltip>
            )}
          </div>
        )
      });
    });
    return data;
  };

  const handleFilterOrders = () => {
    const { limit, offset, selectedFilter } = state;
    const supplierIds = selectedSuppliers.map(supplier => supplier.value);
    const customerIds = selectedCustomers.map(customer => customer.value);
    
    actions.filterOrdersDispatch(
      limit,
      offset,
      selectedFilter,
      selectedDate || moment(),
      supplierIds,
      customerIds
    );
  };

  const handleDeleteOrder = () => {
    const { limit, offset, selectedFilter } = state;
    const supplierIds = selectedSuppliers.map(supplier => supplier.value);
    const customerIds = selectedCustomers.map(customer => customer.value);

    actions.deleteOrders(
      deleteId,
      userType === "customer",
      limit,
      offset,
      selectedFilter,
      selectedDate || moment(),
      supplierIds,
      customerIds
    );
  };

  const handleDisplaySuppliers = () => {
    if (supplierList && supplierList.length > 0) {
      return supplierList.map((supplier: ISupplier) => ({
        value: supplier.id,
        label: supplier.name
      }));
    }
    return [];
  };

  const handleDisplayCustomers = () => {
    if (userList && userList.length > 0) {
      return userList.map((user: IUser) => ({
        value: user.id,
        label: `${user.last_name.toUpperCase()} ${user.first_name}`
      }));
    }
    return [];
  };

  const handleFilterDate = (date: moment.Moment | null) => {
    if (date && userType === "customer") {
      actions.getOrdersForCustomer(10, 0);
    } else if (date && userType === "supplier") {
      actions.filterOrdersDispatch(10, 0, "all", date, [userSupplierId], []);
    } else if (date && userType === "administrator") {
      actions.filterOrdersDispatch(10, 0, "all", date, [], []);
    }
  };

  const handleFilterSuppliers = (suppliers: { value: number; label: string }[]) => {
    if (userType === "administrator") {
      const supplierIds = suppliers.map(supplier => supplier.value);
      actions.filterOrdersDispatch(10, 0, "all", moment(), supplierIds, []);
    }
  };

  const handleFilterCustomers = (customers: { value: number; label: string }[]) => {
    if (userType === "administrator") {
      const customerIds = customers.map(customer => customer.value);
      actions.filterOrdersDispatch(10, 0, "all", moment(), [], customerIds);
    }
  };

  const handleLoadData = (limit: number, offset: number) => {
    if (userType === "customer") {
      actions.getOrdersForCustomer(limit, offset);
    } else if (userType === "supplier") {
      actions.filterOrdersDispatch(limit, offset, "all", moment(), [userSupplierId], []);
    } else if (userType === "administrator") {
      actions.filterOrdersDispatch(limit, offset, "all", moment(), [], []);
    }
  };

  const handleChangeLimit = (limit: number) => {
    setState(prev => ({
      ...prev,
      limit
    }));
  };

  const handleChangeOffset = (offset: number) => {
    setState(prev => ({
      ...prev,
      offset
    }));
  };

  const handleFetchNextData = () => {
    const { limit, offset } = state;
    dispatch(actions.getOrdersForCustomerSpread(limit, offset + limit));
    setState(prev => ({
      ...prev,
      offset: prev.offset + limit
    }));
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }

  const {
    openDetails,
    openDelete,
    openEdit,
    orderDeleted,
    menuEdited,
    menuDeleted,
    detailsId,
    deleteId,
    editCart,
    selectedDate,
    selectedSuppliers,
    selectedCustomers,
    hasMore
  } = state;

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      cartItems={cartList ? cartList.length : 0}
      orderItems={orderList && !all ? orderList.length : 0}
      title={
        all
          ? getTranslation("_COMMANDES")
          : getTranslation("_MES_COMMANDES")
      }
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getTranslation}
    >
      {isEditSuccess && menuEdited && (
        <SnackbarAction
          success
          message={getTranslation("_COMMANDE_BIEN_MODIFIEE")}
          onClose={handleCloseSnackbarMenuEdited}
        />
      )}
      {isDeleteSuccess && menuDeleted && (
        <SnackbarAction
          success
          message={getTranslation("_MENU_BIEN_SUPPRIME_COMMANDE")}
          onClose={handleCloseSnackbarMenuDeleted}
        />
      )}
      {isDeleteSuccess && orderDeleted && (
        <SnackbarAction
          success
          message={getTranslation("_COMMANDE_BIEN_SUPPRIMEE")}
          onClose={handleCloseSnackbarOrderDeleted}
        />
      )}
      {openDetails && (
        <DetailsOrder
          title={`${getTranslation("_DETAILS_DE_LA_COMMANDE")} #${state.detailsId}`}
          order={handleRetrieveOrder() || {
            id: 0,
            date: "",
            User: {
              id: 0,
              first_name: "",
              last_name: "",
              sex: "",
              email_address: "",
              type: "",
              language: "",
              supplier_id: 0,
              password: "",
              token: "",
              validity: "",
              created_at: "",
              updated_at: ""
            },
            Menu: [],
            status: "",
            total_price: 0,
            user_id: 0,
            order_menus: [],
            order_extras: [],
            created_at: "",
            updated_at: "",
            is_carried_away: false,
            is_delivered: false,
            is_paid: false
          } as IOrderInterface}
          userType={userType}
          userLanguage={userLanguage}
          editable={isOrderEditable(
            handleRetrieveOrder()?.date || ""
          )}
          orderExtraList={orderExtraList}
          onEditShoppingCart={handleEdit}
          onDeleteShoppingCart={handleDelete}
          onClose={handleCloseDetails}
          checkDictionnary={getTranslation}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title={getTranslation("_SUPPRIMER_UNE_COMMANDE")}
          description={`La commande #${deleteId} sera définitivement perdue !`}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
          checkDictionnary={getTranslation}
        />
      )}
      {openEdit && (
        <EditCart
          cart={editCart}
          userLanguage={userLanguage}
          onEditShoppingCart={handleEdit}
          onDeleteShoppingCart={handleDelete}
          onClose={handleCloseEdit}
          checkDictionnary={getTranslation}
        />
      )}
      <StyledMain>
        <StyledLayout>
          <StyledCardGrid>
            <StyledHeroUnit>
              {((userType === "administrator" && all) ||
                userType === "supplier") && (
                <OrdersExport
                  exportEl={
                    <StyledButton>
                      <ImportExportIcon /> Exporter les commandes
                    </StyledButton>
                  }
                  orderList={orderList}
                  orderExtraList={orderExtraList}
                />
              )}
              {((userType === "administrator" && all) ||
                userType === "supplier") && (
                <OrdersFilter
                  suppliers={handleDisplaySuppliers()}
                  customers={handleDisplayCustomers()}
                  userType={userType}
                  handleToday={
                    userType === "administrator" || userType === "supplier"
                  }
                  handleSuppliers={userType === "administrator"}
                  handleCustomers={userType === "administrator"}
                  selectedDate={selectedDate}
                  selectedCustomers={selectedCustomers}
                  selectedSuppliers={selectedSuppliers}
                  onChangeDate={handleFilterDate}
                  onChangeSuppliers={handleFilterSuppliers}
                  onChangeCustomers={handleFilterCustomers}
                />
              )}
              <StyledSectionDesktop>
                <Table
                  remotePaging
                  rows={handleTableRows()}
                  columns={handleTableColumns()}
                  defaultSorting={[{ columnName: "date", direction: "desc" }]}
                  totalCount={orderListTotalCount}
                  onChangeLimit={handleChangeLimit}
                  onChangeOffset={handleChangeOffset}
                  onLoadData={handleLoadData}
                />
              </StyledSectionDesktop>
              <StyledSectionMobile>
                <OrdersList
                  userLanguage={userLanguage}
                  orderList={orderList}
                  orderExtraList={orderExtraList}
                  hasMore={hasMore}
                  isListPending={isListPending}
                  onOpenDelete={handleOpenDelete}
                  onOpenEdit={(cart: ICart) => {
                    setState(prev => ({
                      ...prev,
                      openEdit: true,
                      editCart: cart
                    }));
                  }}
                  onFetchNextData={handleFetchNextData}
                  checkDictionnary={getTranslation}
                  isOrderEditable={isOrderEditable}
                />
              </StyledSectionMobile>
            </StyledHeroUnit>
          </StyledCardGrid>
        </StyledLayout>
      </StyledMain>
      <Footer />
    </MenuBar>
  );
};

export default styled(Orders)(({ theme }) => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: ".625rem"
  },
  layout: {
    width: "auto",
    margin: "0 auto"
  },
  cardGrid: {
    padding: 0,
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(4)
    }
  },
  main: {
    flex: 1
  }
}));
