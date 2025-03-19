import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
        padding: theme.spacing.unit * 4
      }
    },
    button: {
      marginTop: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 2
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
  classes: any;
}

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
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
  orderListTotalCount: number;
  supplierList: ISupplier[];
  userList: IUser[];
  settingList: ISetting[];
  actions: any;
  match: any;
}

interface IState {
  openDetails: boolean;
  openDelete: boolean;
  openEdit: boolean;
  orderDeleted: boolean;
  menuEdited: boolean;
  menuDeleted: boolean;
  detailsId: number;
  deleteId: number;
  exportOrder: boolean;
  editCart: ICart;
  selectedDate: moment.Moment | null;
  selectedSuppliers: ISelect[];
  selectedCustomers: ISelect[];
  limit: number;
  offset: number;
  selectedFilter: string;
  selectedSupplierIds: number[];
  selectedCustomerIds: number[];
  hasMore: boolean;
}

class Orders extends Component<IProvidedProps & IProps, IState> {
  private timer: any;

  constructor(props: IProvidedProps & IProps) {
    super(props);

    this.timer = null;
  }

  state = {
    openDetails: false,
    openDelete: false,
    openEdit: false,
    orderDeleted: false,
    menuEdited: false,
    menuDeleted: false,
    detailsId: -1,
    deleteId: -1,
    exportOrder: false,
    editCart: {} as ICart,
    selectedDate: this.props.userType === "supplier" ? moment() : null,
    selectedSuppliers: [],
    selectedCustomers: [],
    limit: 10,
    offset: 0,
    selectedFilter: "",
    selectedSupplierIds: [],
    selectedCustomerIds: [],
    hasMore: true,
    redirectTo: "",
  };

  componentDidMount() {
    const { isLoginSuccess, userToken, userType, userLanguage } = this.props;
    this.timer = setInterval(this.tick, 60000);

    if (isLoginSuccess && userToken) {
      this.refresh();
    }
    if (userType === "supplier") {
      this.handleChangeSelected(3);
      this.setState({
        selectedFilter: "date"
      });
    }
    if (userLanguage == "en") {
      moment.locale("en-gb");
    } else {
      moment.locale("fr");
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = async () => {
    let res = await axios({
      method: "get",
      url: "/api/users/check_validity",
      withCredentials: true
    });
    let { data } = await res;
    let userValidity = data;
    if (userValidity === "not valid") {
      this.props.actions.logout();
    }
  };

  componentDidUpdate(prevProps: IProps) {
    const { userToken, orderList, orderListTotalCount } = this.props;
    const { hasMore } = this.state;
    if (userToken !== prevProps.userToken) {
      this.refresh();
    }
    if (
      hasMore &&
      orderList.length &&
      orderList.length === orderListTotalCount
    ) {
      this.setState({ hasMore: false });
    }
  }

  refresh = () => {
    const { userType, userSupplierId, match } = this.props;
    const { limit, offset } = this.state;
    const all = match.params.id === "all";
    this.tick();

    this.props.actions.getDictionnaries();
    this.props.actions.getSettings();
    if (userType === "administrator") {
      if (all) {
        this.props.actions.getOrders(false, limit, offset);
        this.props.actions.getSuppliers();
        this.props.actions.getCustomers();
      } else {
        this.props.actions.getOrdersForCustomer(limit, offset);
      }
      this.props.actions.getOrdersExtra();
    } else if (userType === "customer") {
      this.props.actions.getOrdersForCustomer(limit, offset);
      this.props.actions.getOrdersExtra();
    } else if (userType === "vendor") {
      this.props.actions.getOrdersForCustomer(limit, offset);
      this.props.actions.getOrdersExtra();
    } else if (userType === "supplier") {
      this.props.actions.getOrdersForSupplier(
        userSupplierId,
        true,
        limit,
        offset
      );
      this.props.actions.getOrdersExtra();
    }
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleCloseSnackbarMenuEdited = () => {
    this.setState({
      menuEdited: false
    });
  };

  handleCloseSnackbarMenuDeleted = () => {
    this.setState({
      menuDeleted: false
    });
  };

  handleCloseSnackbarOrderDeleted = () => {
    this.setState({
      orderDeleted: false
    });
  };

  checkDictionnary = (tag: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  isOrderEditable = (date: string) => {
    const { userType, settingList, match } = this.props;
    const all = match.params.id === "all";
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
    } else {
      return false;
    }
  };

  handleTableColumns = () => {
    const { userType, match } = this.props;
    const all = match.params.id === "all";
    switch (userType) {
      case "customer":
        return [
          {
            name: "date",
            title: "Date"
          },
          {
            name: "pricing",
            title: this.checkDictionnary("_PRIX")
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
            title: this.checkDictionnary("_PRIX")
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
              title: this.checkDictionnary("_PRIX")
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
              title: this.checkDictionnary("_PRIX")
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

  handleTableRows = () => {
    const { userType, userLanguage, orderList, orderExtraList } = this.props;
    if (orderList && orderList.length > 0) {
      const formattedOrders = orderList.map(order => {
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
                x => x.order_menu_id === menu.order_menus.id
              );
              if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
                filteredOrderExtraList.map(orderExtra => {
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
            <Tooltip title={this.checkDictionnary("_DETAILS_DE_LA_COMMANDE")}>
              <IconButton
                color="primary"
                onClick={() => this.handleOpenDetails(order.id)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {userType !== "supplier" && (
              <Tooltip title={this.checkDictionnary("_SUPPRIMER_LA_COMMANDE")}>
                <IconButton
                  color="secondary"
                  onClick={() => this.handleOpenDelete(order.id)}
                  disabled={!this.isOrderEditable(order.date)}
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
    } else {
      return [];
    }
  };

  handleOpenDetails = (id: number) => {
    this.setState({
      openDetails: true,
      detailsId: id
    });
  };

  handleOpenDelete = (id: number) => {
    this.setState({
      openDelete: true,
      deleteId: id
    });
  };

  handleOpenEdit = (cart: ICart) => {
    this.setState({
      openEdit: true,
      editCart: cart
    });
  };

  handleCloseDetails = () => {
    this.setState({
      openDetails: false
    });
  };

  handleCloseDelete = () => {
    this.setState({
      openDelete: false
    });
  };

  handleCloseEdit = () => {
    this.setState({
      openEdit: false
    });
  };

  handleDeleteOrder = () => {
    const { userType, match } = this.props;
    const {
      limit,
      offset,
      selectedFilter,
      selectedDate,
      selectedSupplierIds,
      selectedCustomerIds
    } = this.state;
    const { deleteId } = this.state;
    const all = match.params.id === "all";
    if (deleteId > 0 && userType === "administrator") {
      this.props.actions.deleteOrders(
        deleteId,
        !all,
        limit,
        offset,
        selectedFilter,
        selectedDate,
        selectedSupplierIds,
        selectedCustomerIds
      );
    } else if (deleteId > 0 && userType === "customer") {
      this.props.actions.deleteOrders(deleteId, true, limit, offset);
    }
    this.setState({
      openDelete: false,
      orderDeleted: true
    });
  };

  handleEditMenu = (item: ICart, quantity: number, remark: string) => {
    const { userType, match } = this.props;
    const {
      limit,
      offset,
      selectedFilter,
      selectedDate,
      selectedSupplierIds,
      selectedCustomerIds
    } = this.state;
    const all = match.params.id === "all";
    this.props.actions.editOrder(
      item.menu.order_menus.order_id,
      item.menu.id,
      quantity,
      remark,
      !(userType === "administrator") || (userType === "administrator" && !all),
      limit,
      offset,
      selectedFilter,
      selectedDate,
      selectedSupplierIds,
      selectedCustomerIds
    );
    this.setState({
      openEdit: false,
      menuEdited: true
    });
  };

  handleDeleteMenu = (item: ICart) => {
    const { userType, match } = this.props;
    const {
      limit,
      offset,
      selectedFilter,
      selectedDate,
      selectedSupplierIds,
      selectedCustomerIds
    } = this.state;
    const all = match.params.id === "all";
    if (userType === "administrator") {
      this.props.actions.deleteOrder(
        item.menu.order_menus.order_id,
        item.menu.id,
        !all,
        limit,
        offset,
        selectedFilter,
        selectedDate,
        selectedSupplierIds,
        selectedCustomerIds
      );
    } else if (userType === "customer") {
      this.props.actions.deleteOrder(
        item.menu.order_menus.order_id,
        item.menu.id,
        true,
        limit,
        offset
      );
    }
    this.setState({
      openEdit: false,
      menuDeleted: true
    });
  };

  handleRetrieveOrder = () => {
    const { detailsId } = this.state;
    const { orderList } = this.props;
    let selectedOrder = {} as IOrder;
    if (orderList && orderList.length > 0) {
      selectedOrder = orderList.filter(x => x.id === detailsId)[0];
    }
    return selectedOrder;
  };

  handleDisplaySuppliers = () => {
    const { supplierList } = this.props;
    if (supplierList && supplierList.length > 0) {
      return supplierList.map(supplier => {
        const obj: ISelect = { value: supplier.id, label: supplier.name };
        return obj;
      });
    }
    return [];
  };

  handleDisplayCustomers = () => {
    const { userList } = this.props;
    if (userList && userList.length > 0) {
      return userList.map(user => {
        const obj: ISelect = {
          value: user.id,
          label: `${user.last_name.toUpperCase()} ${user.first_name}`
        };
        return obj;
      });
    }
    return [];
  };

  handleFilterDate = (date: moment.Moment) => {
    const { userType, userSupplierId } = this.props;
    const { limit, offset } = this.state;
    if (date) {
      this.props.actions.getOrdersForDate(
        date.format("YYYY-MM-DD"),
        limit,
        offset
      );
      this.setState({
        selectedFilter: "date"
      });
    } else {
      if (userType === "administrator") {
        this.props.actions.getOrders(false, limit, offset);
      } else if (userType === "customer") {
        this.props.actions.getOrdersForCustomer(limit, offset);
      } else if (userType === "supplier") {
        this.props.actions.getOrdersForSupplier(
          userSupplierId,
          false,
          limit,
          offset
        );
      }
      this.setState({
        selectedFilter: "",
        limit: 10,
        offset: 0
      });
    }
    this.setState({
      selectedDate: date,
      selectedSuppliers: [],
      selectedCustomers: []
    });
  };

  handleFilterSuppliers = (suppliers: ISelect[]) => {
    const { limit, offset } = this.state;
    if (suppliers && suppliers.length > 0) {
      const ids = suppliers.map(supplier => supplier.value);
      this.props.actions.getOrdersForSuppliers(ids, limit, offset);
      this.setState({
        selectedFilter: "suppliers",
        selectedSupplierIds: ids
      });
    } else {
      this.props.actions.getOrders(false, limit, offset);
      this.setState({
        selectedFilter: "",
        selectedSupplierIds: [],
        limit: 10,
        offset: 0
      });
    }
    this.setState({
      selectedDate: null,
      selectedSuppliers: suppliers,
      selectedCustomers: []
    });
  };

  handleFilterCustomers = (customers: ISelect[]) => {
    const { limit, offset } = this.state;
    if (customers && customers.length > 0) {
      const ids = customers.map(customer => customer.value);
      this.props.actions.getOrdersForCustomers(ids, limit, offset);
      this.setState({
        selectedFilter: "customers",
        selectedCustomerIds: ids
      });
    } else {
      this.props.actions.getOrders(false, limit, offset);
      this.setState({
        selectedFilter: "",
        selectedCustomerIds: [],
        limit: 10,
        offset: 0
      });
    }
    this.setState({
      selectedDate: null,
      selectedSuppliers: [],
      selectedCustomers: customers
    });
  };

  handleExport = () => {
    this.setState({
      exportOrder: true
    });
  };

  handleLoadData = (limit: number, offset: number) => {
    const { match, userType, userSupplierId } = this.props;
    const {
      selectedFilter,
      selectedDate,
      selectedSupplierIds,
      selectedCustomerIds
    } = this.state;
    const all = match.params.id === "all";
    if (userType === "administrator") {
      if (all) {
        switch (selectedFilter) {
          case "date":
            this.props.actions.getOrdersForDate(
              selectedDate ? selectedDate.format("YYYY-MM-DD") : selectedDate,
              limit,
              offset
            );
            break;
          case "suppliers":
            this.props.actions.getOrdersForSuppliers(
              selectedSupplierIds,
              limit,
              offset
            );
            break;
          case "customers":
            this.props.actions.getOrdersForCustomers(
              selectedCustomerIds,
              limit,
              offset
            );
            break;
          default:
            this.props.actions.getOrders(false, limit, offset);
            break;
        }
      } else {
        this.props.actions.getOrdersForCustomer(limit, offset);
      }
    } else if (userType === "customer") {
      this.props.actions.getOrdersForCustomer(limit, offset);
    } else if (userType === "vendor") {
      this.props.actions.getOrdersForCustomer(limit, offset);
    } else if (userType === "supplier") {
      switch (selectedFilter) {
        case "date":
          this.props.actions.getOrdersForDate(
            selectedDate ? selectedDate.format("YYYY-MM-DD") : selectedDate,
            limit,
            offset
          );
          break;
        default:
          this.props.actions.getOrdersForSupplier(
            userSupplierId,
            false,
            limit,
            offset
          );
          break;
      }
    }
  };

  handleChangeLimit = (limit: number) => {
    this.setState({
      limit
    });
  };

  handleChangeOffset = (offset: number) => {
    this.setState({
      offset
    });
  };

  handleFetchNextData = () => {
    const { limit, offset } = this.state;
    this.props.actions.getOrdersForCustomerSpread(limit, offset + limit);
    this.setState(prevState => ({
      offset: prevState.offset + limit
    }));
  };

  render() {
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
    } = this.state;
    const {
      isLoginSuccess,
      isListPending,
      isEditSuccess,
      isDeleteSuccess,
      selected,
      userType,
      userLanguage,
      cartList,
      orderList,
      orderExtraList,
      orderListTotalCount,
      classes,
      match
    } = this.props;
    if (!isLoginSuccess) {
      return <Redirect to="/login" />;
    }
    const all = match.params.id === "all";
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
            ? this.checkDictionnary("_COMMANDES")
            : this.checkDictionnary("_MES_COMMANDES")
        }
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isEditSuccess && menuEdited && (
          <SnackbarAction
            success
            message={this.checkDictionnary("_COMMANDE_BIEN_MODIFIEE")}
            onClose={this.handleCloseSnackbarMenuEdited}
          />
        )}
        {isDeleteSuccess && menuDeleted && (
          <SnackbarAction
            success
            message={this.checkDictionnary("_MENU_BIEN_SUPPRIME_COMMANDE")}
            onClose={this.handleCloseSnackbarMenuDeleted}
          />
        )}
        {isDeleteSuccess && orderDeleted && (
          <SnackbarAction
            success
            message={this.checkDictionnary("_COMMANDE_BIEN_SUPPRIMEE")}
            onClose={this.handleCloseSnackbarOrderDeleted}
          />
        )}
        {openDetails && (
          <DetailsOrder
            title={`${this.checkDictionnary(
              "_DETAILS_DE_LA_COMMANDE"
            )} #${detailsId}`}
            order={this.handleRetrieveOrder()}
            userType={userType}
            userLanguage={userLanguage}
            editable={this.isOrderEditable(
              this.handleRetrieveOrder() ? this.handleRetrieveOrder().date : ""
            )}
            orderExtraList={orderExtraList}
            onEditShoppingCart={this.handleEditMenu}
            onDeleteShoppingCart={this.handleDeleteMenu}
            onClose={this.handleCloseDetails}
            checkDictionnary={this.checkDictionnary}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title={this.checkDictionnary("_SUPPRIMER_UNE_COMMANDE")}
            description={`La commande #${deleteId} sera définitivement perdue !`}
            onClose={this.handleCloseDelete}
            onDelete={this.handleDeleteOrder}
            checkDictionnary={this.checkDictionnary}
          />
        )}
        {openEdit && (
          <EditCart
            cart={editCart}
            userLanguage={userLanguage}
            onEditShoppingCart={this.handleEditMenu}
            onDeleteShoppingCart={this.handleDeleteMenu}
            onClose={this.handleCloseEdit}
            checkDictionnary={this.checkDictionnary}
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
                  suppliers={this.handleDisplaySuppliers()}
                  customers={this.handleDisplayCustomers()}
                  userType={userType}
                  handleToday={
                    userType === "administrator" || userType === "supplier"
                  }
                  handleSuppliers={userType === "administrator"}
                  handleCustomers={userType === "administrator"}
                  selectedDate={selectedDate}
                  selectedCustomers={selectedCustomers}
                  selectedSuppliers={selectedSuppliers}
                  onChangeDate={this.handleFilterDate}
                  onChangeSuppliers={this.handleFilterSuppliers}
                  onChangeCustomers={this.handleFilterCustomers}
                />
              )}
              <div className={classes.sectionDesktop}>
                <Table
                  remotePaging
                  rows={this.handleTableRows()}
                  columns={this.handleTableColumns()}
                  defaultSorting={[{ columnName: "date", direction: "desc" }]}
                  totalCount={orderListTotalCount}
                  onChangeLimit={this.handleChangeLimit}
                  onChangeOffset={this.handleChangeOffset}
                  onLoadData={this.handleLoadData}
                />
              </div>
              <div className={classes.sectionMobile}>
                <OrdersList
                  userLanguage={userLanguage}
                  orderList={orderList}
                  orderExtraList={orderExtraList}
                  hasMore={hasMore}
                  isListPending={isListPending}
                  onOpenDelete={this.handleOpenDelete}
                  onOpenEdit={this.handleOpenEdit}
                  onFetchNextData={this.handleFetchNextData}
                  checkDictionnary={this.checkDictionnary}
                  isOrderEditable={this.isOrderEditable}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Orders);
