import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import "moment/locale/en-gb";
import "moment/locale/fr";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import ImportExportIcon from "@material-ui/icons/ImportExport";
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
import IOrder from "../../interfaces/IOrder";
import IOrderDisplay from "../../interfaces/IOrderDisplay";
import { RootState, AppDispatch } from "../../types/redux";
import { logout } from "../../actions/login";
import { setSelected } from "../../actions/page";
import { 
  getOrders,
  getOrdersForCustomer,
  getOrdersForSupplier,
  getOrdersExtra,
  getOrdersForDate,
  getOrdersForSuppliers,
  getOrdersForCustomers,
  getOrdersForCustomerSpread
} from "../../actions/order";
import {
  deleteOrders,
  deleteOrder,
  editOrder
} from "../../actions/order";
import { getDictionnaries } from "../../actions/dictionnary";
import { getSettings } from "../../actions/setting";
import { getSuppliers } from "../../actions/supplier";
import { getCustomers } from "../../actions/user";
import axios from "axios";

const styles = (theme: Theme) =>
  createStyles({
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
    button: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2)
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    },
    main: {
      flex: 1
    }
  });

interface IProvidedProps {
  classes: {
    heroUnit: string;
    layout: string;
    cardGrid: string;
    button: string;
    sectionDesktop: string;
    sectionMobile: string;
    main: string;
  };
}

interface IProps extends IProvidedProps {
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
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
  orderListTotalCount: number;
  supplierList: ISupplier[];
  userList: IUser[];
  settingList: ISetting[];
  actions: {
    logout: () => (dispatch: AppDispatch) => void;
    getDictionnaries: () => (dispatch: AppDispatch) => void;
    getSettings: () => (dispatch: AppDispatch) => void;
    getOrders: (limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForCustomer: (limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForSupplier: (supplierId: number, todayOnly: boolean, limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersExtra: () => (dispatch: AppDispatch) => void;
    getSuppliers: () => (dispatch: AppDispatch) => void;
    getCustomers: () => (dispatch: AppDispatch) => void;
    getOrdersForDate: (date: string, limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForSuppliers: (supplierIds: number[], limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForCustomers: (customerIds: number[], limit: number, offset: number) => (dispatch: AppDispatch) => void;
    getOrdersForCustomerSpread: (limit: number, offset: number) => (dispatch: AppDispatch) => void;
    deleteOrders: (ids: number[]) => (dispatch: AppDispatch) => void;
    deleteOrder: (id: number) => (dispatch: AppDispatch) => void;
    editOrder: (id: number, data: Partial<IOrder>) => (dispatch: AppDispatch) => void;
    setSelected: (selected: number) => (dispatch: AppDispatch) => void;
  };
  match: {
    params: {
      id?: string;
    };
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

const Orders: React.FC<IProps> = ({ classes, ...props }) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const all = params.id === "all";

  const {
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
  } = props;

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
    dispatch(actions.getDictionnaries());
    dispatch(actions.getSettings());

    if (userType === "administrator") {
      if (all) {
        dispatch(actions.getOrders(limit, offset));
        dispatch(actions.getSuppliers());
        dispatch(actions.getCustomers());
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
    if (orderList && orderList.length > 0) {
      const formattedOrders = orderList.map((order: IOrder) => {
        const obj: Partial<IOrderDisplay> = {};
        obj.id = order.id;
        obj.date = moment(order.date).format(
          userLanguage === "en" ? "MM/DD/YYYY" : "DD/MM/YYYY"
        );
        if (order.User) {
          obj.client = `${
            order.User.first_name
          } ${order.User.last_name.toUpperCase()}`;
        } else {
          obj.client = `DOE John`;
        }
        let pricing = 0;
        if (order.Menu && order.Menu.length > 0) {
          const pricingArray = order.Menu.map((menu: IMenu) => {
            let pricingTmp =
              parseFloat(menu.order_menus.pricing) * menu.order_menus.quantity;
            if (orderExtraList && orderExtraList.length > 0) {
              const filteredOrderExtraList = orderExtraList.filter(
                (x: IOrderExtra) => x.order_menu_id === menu.order_menus.id
              );
              if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
                filteredOrderExtraList.map((orderExtra: IOrderExtra) => {
                  pricingTmp +=
                    parseFloat(orderExtra.pricing) * menu.order_menus.quantity;
                });
              }
            }
            return pricingTmp;
          });
          pricing = pricingArray.reduce((a: number, b: number) => a + b, 0);
        }
        obj.pricing = `${pricing.toLocaleString("fr", {
          minimumFractionDigits: 2
        })} €`;
        obj.action = (
          <>
            <Tooltip title={getTranslation("_DETAILS_DE_LA_COMMANDE")}>
              <IconButton
                color="primary"
                onClick={() => handleOpenDetails(order.id)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {userType !== "supplier" && (
              <Tooltip title={getTranslation("_SUPPRIMER_LA_COMMANDE")}>
                <IconButton
                  color="secondary"
                  onClick={() => handleOpenDelete(order.id)}
                  disabled={!isOrderEditable(order.date)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
        return obj;
      });
      return formattedOrders;
    }
    return [];
  };

  const handleOpenDetails = (id: number) => {
    setState(prev => ({
      ...prev,
      openDetails: true,
      detailsId: id
    }));
  };

  const handleOpenDelete = (id: number) => {
    setState(prev => ({
      ...prev,
      openDelete: true,
      deleteId: id
    }));
  };

  const handleOpenEdit = (cart: ICart) => {
    setState(prev => ({
      ...prev,
      openEdit: true,
      editCart: cart
    }));
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
    if (deleteId > 0 && userType === "administrator") {
      dispatch(actions.deleteOrders([deleteId]));
    } else if (deleteId > 0 && userType === "customer") {
      dispatch(actions.deleteOrders([deleteId]));
    }
    setState(prev => ({
      ...prev,
      openDelete: false,
      deleteId: 0
    }));
  };

  const handleEdit = () => {
    if (editCart.menu) {
      dispatch(actions.editOrder(editCart.menu.id, {
        date: moment().format("YYYY-MM-DD"),
        Menu: [{
          ...editCart.menu,
          order_menus: {
            ...editCart.menu.order_menus,
            quantity: editCart.quantity,
            remark: editCart.remark
          }
        }]
      }));
    }
    setState(prev => ({
      ...prev,
      openEdit: false,
      editCart: {} as ICart
    }));
  };

  const handleRetrieveOrder = (): IOrder | undefined => {
    const { detailsId } = state;
    return orderList.find((order: IOrder) => order.id === detailsId);
  };

  const handleRetrieveOrderExtra = (menuId: number): IOrderExtra | undefined => {
    return orderExtraList.find((orderExtra: IOrderExtra) => orderExtra.order_menu_id === menuId);
  };

  const handleTableData = () => {
    const data: IOrderDisplay[] = [];
    orderList.forEach((order: IOrder) => {
      const pricing = order.Menu.reduce((acc: number, menu: IMenu) => {
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
              <IconButton
                onClick={() => handleOpenDetails(order.id)}
                className={classes.button}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {isOrderEditable(order.date) && (
              <Tooltip title={getTranslation("_SUPPRIMER")}>
                <IconButton
                  onClick={() => handleOpenDelete(order.id)}
                  className={classes.button}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        )
      });
    });
    return data;
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
    const { limit, offset } = state;

    if (date) {
      dispatch(actions.getOrdersForDate(
        date.format("YYYY-MM-DD"),
        limit,
        offset
      ));
      setState(prev => ({
        ...prev,
        selectedFilter: "date",
        selectedDate: date,
        selectedSuppliers: [],
        selectedCustomers: [],
        selectedSupplierIds: [],
        selectedCustomerIds: []
      }));
    } else {
      if (userType === "administrator") {
        dispatch(actions.getOrders(limit, offset));
      } else if (userType === "customer") {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      } else if (userType === "supplier") {
        dispatch(actions.getOrdersForSupplier(
          userSupplierId,
          false,
          limit,
          offset
        ));
      }
      setState(prev => ({
        ...prev,
        selectedFilter: "",
        selectedDate: null,
        selectedSuppliers: [],
        selectedCustomers: [],
        selectedSupplierIds: [],
        selectedCustomerIds: [],
        limit: 10,
        offset: 0
      }));
    }
  };

  const handleFilterSuppliers = (suppliers: ISelect[]) => {
    const { limit, offset } = state;

    if (suppliers && suppliers.length > 0) {
      const ids = suppliers.map((supplier: ISelect) => supplier.value);
      dispatch(actions.getOrdersForSuppliers(ids, limit, offset));
      setState(prev => ({
        ...prev,
        selectedFilter: "suppliers",
        selectedSupplierIds: ids,
        selectedDate: null,
        selectedSuppliers: suppliers,
        selectedCustomers: []
      }));
    } else {
      dispatch(actions.getOrders(limit, offset));
      setState(prev => ({
        ...prev,
        selectedFilter: "",
        selectedSupplierIds: [],
        selectedDate: null,
        selectedSuppliers: [],
        selectedCustomers: [],
        limit: 10,
        offset: 0
      }));
    }
  };

  const handleFilterCustomers = (customers: ISelect[]) => {
    const { limit, offset } = state;

    if (customers && customers.length > 0) {
      const ids = customers.map((customer: ISelect) => customer.value);
      dispatch(actions.getOrdersForCustomers(ids, limit, offset));
      setState(prev => ({
        ...prev,
        selectedFilter: "customers",
        selectedCustomerIds: ids,
        selectedDate: null,
        selectedSuppliers: [],
        selectedCustomers: customers
      }));
    } else {
      dispatch(actions.getOrders(limit, offset));
      setState(prev => ({
        ...prev,
        selectedFilter: "",
        selectedCustomerIds: [],
        selectedDate: null,
        selectedSuppliers: [],
        selectedCustomers: [],
        limit: 10,
        offset: 0
      }));
    }
  };

  const handleLoadData = (limit: number, offset: number) => {
    const { selectedFilter, selectedDate, selectedSupplierIds, selectedCustomerIds } = state;

    if (userType === "administrator") {
      if (all) {
        switch (selectedFilter) {
          case "date":
            dispatch(actions.getOrdersForDate(
              selectedDate ? selectedDate.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
              limit,
              offset
            ));
            break;
          case "suppliers":
            dispatch(actions.getOrdersForSuppliers(
              selectedSupplierIds,
              limit,
              offset
            ));
            break;
          case "customers":
            dispatch(actions.getOrdersForCustomers(
              selectedCustomerIds,
              limit,
              offset
            ));
            break;
          default:
            dispatch(actions.getOrders(limit, offset));
            break;
        }
      } else {
        dispatch(actions.getOrdersForCustomer(limit, offset));
      }
    } else if (userType === "customer" || userType === "vendor") {
      dispatch(actions.getOrdersForCustomer(limit, offset));
    } else if (userType === "supplier") {
      switch (selectedFilter) {
        case "date":
          dispatch(actions.getOrdersForDate(
            selectedDate ? selectedDate.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
            limit,
            offset
          ));
          break;
        default:
          dispatch(actions.getOrdersForSupplier(
            userSupplierId,
            false,
            limit,
            offset
          ));
          break;
      }
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
              supplier_id: 0
            },
            Menu: []
          } as IOrder}
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
      <main className={classes.main}>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <div className={classes.heroUnit}>
            {((userType === "administrator" && all) ||
              userType === "supplier") && (
              <OrdersExport
                exportEl={
                  <Button className={classes.button}>
                    <ImportExportIcon /> Exporter les commandes
                  </Button>
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
            <div className={classes.sectionDesktop}>
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
            </div>
            <div className={classes.sectionMobile}>
              <OrdersList
                userLanguage={userLanguage}
                orderList={orderList}
                orderExtraList={orderExtraList}
                hasMore={hasMore}
                isListPending={isListPending}
                onOpenDelete={handleOpenDelete}
                onOpenEdit={handleOpenEdit}
                onFetchNextData={handleFetchNextData}
                checkDictionnary={getTranslation}
                isOrderEditable={isOrderEditable}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </MenuBar>
  );
};

export default withStyles(styles)(Orders);
