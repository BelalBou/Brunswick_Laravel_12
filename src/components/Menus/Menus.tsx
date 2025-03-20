import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { throttle } from "throttle-debounce";
import classNames from "classnames";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListSubheader from "@material-ui/core/ListSubheader";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import MenuCard from "../MenuCard/MenuCard";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import TabContainer from "../TabContainer/TabContainer";
import DetailsMenu from "../DetailsMenu/DetailsMenu";
import AddCart from "../AddCart/AddCart";
import MenusList from "../MenusList/MenusList";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ICategory from "../../interfaces/ICategory";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import ISupplier from "../../interfaces/ISupplier";
import emptyMenu from "../../images/menu.svg";
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
    listSubHeader: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 2
    },
    h5: {
      fontWeight: 600
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
  theme: Theme;
}

interface IProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userToken: string;
  userLanguage: string;
  userType: string;
  userValidity: string;
  selected: number;
  dictionnaryList: any[];
  supplierList: ISupplier[];
  categoryList: ICategory[];
  menuList: IMenu[];
  cartList: ICart[];
  orderListTotalCount: number;
  actions: any;
  match: any;
}

interface IState {
  selectedSupplier: number;
  shoppingCartOrdered: boolean;
  openDetails: boolean;
  detailsTitle: string;
  detailsSize: string;
  detailsDescription: string;
  detailsAllergies: string[];
  openAdd: boolean;
  addMenu: any;
  collapsed: boolean;
  redirectTo: string;
  searchTerm: string;
}

class Menus extends Component<IProvidedProps & IProps, IState> {
  private timer: any;

  constructor(props: IProvidedProps & IProps) {
    super(props);

    this.timer = null;
    this.state = {
      selectedSupplier: 1,
      shoppingCartOrdered: true,
      openDetails: false,
      detailsTitle: "",
      detailsSize: "",
      detailsDescription: "",
      detailsAllergies: [],
      openAdd: false,
      addMenu: null,
      collapsed: false,
      redirectTo: "",
      searchTerm: ""
    };
  }

  componentDidMount() {
    const { isLoginSuccess, userToken } = this.props;
    this.timer = setInterval(this.tick, 60000);
    if (isLoginSuccess && userToken !== "") {
      this.refresh();
    }
    this.handleChangeSelected(1);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { userToken, supplierList } = this.props;
    if (userToken !== prevProps.userToken) {
      this.refresh();
    }
    if (supplierList !== prevProps.supplierList) {
      if (supplierList && supplierList.length > 0) {
        this.props.actions.getCategoriesSupplier(supplierList[0].id);
        this.props.actions.getMenusSupplier(supplierList[0].id);
        this.setState({
          selectedSupplier: supplierList[0].id
        });
      }
    }
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

/*   tick = async () => {
    await this.props.actions.checkUserValidity();
    const { userValidity } = this.props;
    if (userValidity === "not valid") {
      this.props.actions.logout();
    }
  };
 */

  refresh = () => {
    this.tick();

    const {
      getDictionnaries,
      getSuppliers,
      getOrdersTotalCountForCustomer
    } = this.props.actions;
    getDictionnaries();
    getSuppliers();
    getOrdersTotalCountForCustomer();
  };

  handleChangeSelectedSupplier = (
    event: React.ChangeEvent<{}>,
    value: number
  ) => {
    this.setState({ selectedSupplier: value });
    this.props.actions.getCategoriesSupplier(value);
    this.props.actions.getMenusSupplier(value);
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleAddShoppingCart = (item: ICart) => {
    const { cartList } = this.props;
    let shoppingCartCopy = [...cartList];
    let exist = shoppingCartCopy.filter(x => x.menu.id === item.menu.id);
    if (exist && exist.length > 0) {
      exist[0].quantity += item.quantity;
      shoppingCartCopy = shoppingCartCopy.filter(
        x => x.menu.id !== item.menu.id
      );
      shoppingCartCopy.push(exist[0]);
    } else {
      shoppingCartCopy.push(item);
    }
    this.props.actions.setCartList(shoppingCartCopy);
    localStorage.setItem("cartList", JSON.stringify(shoppingCartCopy));
    this.setState({
      redirectTo: "/cart/success"
    });
  };

  handleCloseSnackbarOrdered = () => {
    this.setState({
      shoppingCartOrdered: false
    });
  };

  handleOpenDetails = (
    title: string,
    size: string,
    description: string,
    allergies: string[]
  ) => {
    this.setState({
      openDetails: true,
      detailsTitle: title,
      detailsSize: size,
      detailsDescription: description,
      detailsAllergies: allergies
    });
  };

  handleCloseDetails = () => {
    this.setState({
      openDetails: false
    });
  };

  handleOpenAdd = (menu: IMenu) => {
    this.setState({
      openAdd: true,
      addMenu: menu
    });
  };

  handleCloseAdd = () => {
    this.setState({
      openAdd: false
    });
  };

  handleSearch = (search: string) => {
    const { selectedSupplier } = this.state;
    this.setState({
      searchTerm: search
    });
  };

  checkDictionnary = (tag: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  render() {
    const {
      selectedSupplier,
      shoppingCartOrdered,
      openDetails,
      detailsTitle,
      detailsSize,
      detailsDescription,
      detailsAllergies,
      openAdd,
      addMenu,
      redirectTo,
      searchTerm
    } = this.state;
    const {
      isLoginSuccess,
      isListPending,
      supplierList,
      categoryList,
      menuList,
      cartList,
      orderListTotalCount,
      userType,
      selected,
      userLanguage,
      classes,
      theme,
      match
    } = this.props;

    const searchResults = menuList.filter(
      x =>
        x.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        x.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        (x.MenuSize
          ? x.MenuSize.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
            x.MenuSize.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase())
          : false) ||
        x.description.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        x.description_en.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        x.Category.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        x.Category.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );

    if (!isLoginSuccess) {
      return <Redirect to="/login" />;
    }
    if (userType === "supplier") {
      return <Redirect to="/orders" />;
    }
    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }
    return (
      <MenuBar
        isLoginSuccess={isLoginSuccess}
        isListPending={isListPending}
        userType={userType}
        cartItems={cartList ? cartList.length : 0}
        orderItems={orderListTotalCount || 0}
        selected={selected}
        search
        title="Menus"
        onLogout={this.handleLogout}
        onSearch={this.handleSearch}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {shoppingCartOrdered && match.params.id === "success" && (
          <SnackbarAction
            success
            message={this.checkDictionnary("_COMMANDE_SUCCES")}
            onClose={this.handleCloseSnackbarOrdered}
          />
        )}
        {openDetails && (
          <DetailsMenu
            title={detailsTitle}
            size={detailsSize}
            description={detailsDescription}
            allergies={detailsAllergies}
            onClose={this.handleCloseDetails}
          />
        )}
        {openAdd && (
          <AddCart
            menu={addMenu}
            menus={menuList.filter(x => x.title === addMenu.title)}
            userLanguage={userLanguage}
            onAdd={this.handleAddShoppingCart}
            onClose={this.handleCloseAdd}
            checkDictionnary={this.checkDictionnary}
          />
        )}
        <main className={classes.main}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <div className={classes.heroUnit}>
              <Tabs
                value={selectedSupplier}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                onChange={this.handleChangeSelectedSupplier}
              >
                {supplierList
                  .filter(supplier =>
                    userType !== "vendor"
                      ? supplier.for_vendor_only !== true
                      : true
                  )
                  .map(supplier => (
                    <Tab
                      key={supplier.id}
                      label={supplier.name}
                      icon={<RestaurantIcon />}
                      value={supplier.id}
                    />
                  ))}
              </Tabs>
              {supplierList.map(supplier => (
                <Fragment key={supplier.id}>
                  {selectedSupplier === supplier.id && (
                    <TabContainer dir={theme.direction}>
                    {searchTerm && searchTerm != '' && searchResults
                          .length == 0 && (
                            <div className={classes.div}><br /><br />
    <Typography
      variant="h6"
      align="left"
      color="textPrimary"
      gutterBottom
      className={classes.h5}
    >
      {this.checkDictionnary("_NO_RESULTS_FOR_YOUR_SEARCH")} :
    </Typography>
    <Typography
      variant="subtitle1"
      align="left"
      color="textSecondary"
      gutterBottom
      className={classes.h5}
    ><i>{searchTerm}</i></Typography>
</div>
                          )}

                      {categoryList.map(category => (
                        <Fragment key={category.id}>
                          {searchResults
                          .filter(
                            menu => menu.category_id === category.id
                          ).length > 0 && (
                            <>
                              <ListSubheader
                                className={classes.listSubHeader}
                                disableSticky
                              >
                                <Typography variant="h5" className={classes.h5}>
                                  {userLanguage === "en"
                                    ? category.title_en
                                    : category.title}
                                </Typography>
                              </ListSubheader>
                              <div className={classes.sectionDesktop}>
                                <MenuCard
                                  userLanguage={userLanguage}
                                  menuList={menuList.filter(
                                      x =>
                                        x.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                        x.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                        (x.MenuSize
                                          ? x.MenuSize.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                            x.MenuSize.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                                          : false) ||
                                        x.description.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                        x.description_en.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                        x.Category.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                        x.Category.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                                    )
                                    .filter(
                                      menu => menu.category_id === category.id
                                    )
                                    .sort((a, b) =>
                                      a.title.localeCompare(b.title)
                                    )}
                                  onOpenAdd={this.handleOpenAdd}
                                />
                              </div>
                              <div className={classes.sectionMobile}>
                                <MenusList
                                  userLanguage={userLanguage}
                                  menuList={menuList.filter(
                                    x =>
                                      x.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                      x.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                      (x.MenuSize
                                        ? x.MenuSize.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                          x.MenuSize.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                                        : false) ||
                                      x.description.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                      x.description_en.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                      x.Category.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                                      x.Category.title_en.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                                  )
                                    .filter(
                                      menu => menu.category_id === category.id
                                    )
                                    .sort((a, b) =>
                                      a.title.localeCompare(b.title)
                                    )}
                                  onOpenAdd={this.handleOpenAdd}
                                />
                              </div>
                            </>
                          )}
                        </Fragment>
                      ))}
                    </TabContainer>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Menus);
