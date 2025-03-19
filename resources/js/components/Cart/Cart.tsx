import React, {Component} from "react";
import {Navigate} from "react-router-dom";
import classNames from "classnames";
import moment from "moment";
import "moment/locale/en-gb";
import "moment/locale/fr";
import {withStyles, Theme, createStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import CartTable from "../CartTable/CartTable";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import CartRecap from "../CartRecap/CartRecap";
import CartList from "../CartList/CartList";
import EditCart from "../EditCart/EditCart";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import menuSort from "../../utils/MenuSort2/MenuSort2";
import ICart from "../../interfaces/ICart";
import ISetting from "../../interfaces/ISetting";
import IExtra from "../../interfaces/IExtra";
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
    is_away: boolean;
    userId: number;
    userToken: string;
    userLanguage: string;
    userType: string;
    userValidity: string;
    selected: number;
    dictionnaryList: any[];
    cartList: ICart[];
    settingList: ISetting[];
    orderListTotalCount: number;
    actions: any;
    match: any;
    serverTime: string;
}

interface IState {
    shoppingCartAdded: boolean;
    shoppingCartEdited: boolean;
    shoppingCartDeleted: boolean;
    shoppingCartToolate: boolean;
    openEdit: boolean;
    editCart: ICart;
    redirectTo: string;
    serverTime: string;
}

class Cart extends Component<IProvidedProps & IProps, IState> {
    private timer: any;

    constructor(props: IProvidedProps & IProps) {
        super(props);

        this.timer = null;
    }

    state = {
        shoppingCartAdded: true,
        shoppingCartToolate: true,
        shoppingCartEdited: false,
        shoppingCartDeleted: false,
        is_away: false,
        openEdit: false,
        editCart: {} as ICart,
        redirectTo: "",
        serverTime: ""
    };

    avaSupp = async () => {
        const {cartList} = this.props;
        let ok = false;

        let res = await axios({
            method: "get",
            url: "/api/suppliers/list/"
        });

        let {data} = await res;
        let supplierDB: any[] = data;
        let newCart: ICart[] = [];
        console.log(supplierDB);
        console.log('cART LIST',cartList);

        if (cartList.length) {
            supplierDB.forEach((sup) => {
                cartList.forEach((el) => {
                    if (el.menu.Supplier.id === sup.id) {
                        el.menu.Supplier.away_start = sup.away_start;
                        el.menu.Supplier.away_end = sup.away_end;
                        newCart.push(el);
                        ok = true;
                    }
                })
            })
        }

        localStorage.removeItem('cartList');

        if (ok) {
            localStorage.setItem("cartList", JSON.stringify(newCart));
            ok = false;
        } else
            localStorage.setItem("cartList", JSON.stringify([]));
    };

    componentDidMount() {
        const {isLoginSuccess, userLanguage} = this.props;
        this.timer = setInterval(this.tick, 60000);

        if (isLoginSuccess) {
            this.refresh();
        }

        this.handleChangeSelected(2);
        if (userLanguage === "en") {
            moment.locale("en-gb");
        } else {
            moment.locale("fr");
        }
        this.avaSupp();
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
        let {data} = await res;
        let userValidity = data;
        if (userValidity === "not valid") {
            this.props.actions.logout();
        }
    };

    getServerTime = async () => {
        let res = await axios({
            method: "get",
            url: "/api/orders/check_time/",
            withCredentials: true
        });
        let {data} = await res;
        this.setState({serverTime: data});
    };

    componentDidUpdate(prevProps: IProps) {
        const {userToken, userLanguage} = this.props;
        if (userToken !== prevProps.userToken) {
            this.refresh();
        }
        if (userLanguage !== prevProps.userLanguage) {
            moment.locale(userLanguage === "fr" ? "fr" : "en-gb");
        }
    }

    refresh = () => {
        this.tick();
        this.props.actions.getDictionnaries();
        this.props.actions.getSettings();
        this.props.actions.getOrdersTotalCountForCustomer();
        this.getServerTime();
    };

    handleLogout = () => {
        this.props.actions.logout();
    };

    handleChangeSelected = (selected: number) => {
        this.props.actions.setSelected(selected);
        localStorage.setItem("selected", selected.toString());
        this.props.actions.getServerTime();
    };

    handleEditShoppingCart = (cart: ICart, quantity: number, remark: string) => {
        const {cartList} = this.props;
        if (isNaN(quantity)) {
            return;
        }
        let cartListCopy = [...cartList];
        let exist = cartListCopy.filter(x => x.menu.id === cart.menu.id);
        if (exist && exist.length > 0) {
            exist[0].quantity = quantity;
            exist[0].remark = remark;
            cartListCopy = cartListCopy.filter(x => x.menu.id !== cart.menu.id);
            cartListCopy.push(exist[0]);
        }
        this.props.actions.setCartList(cartListCopy);
        localStorage.setItem("cartList", JSON.stringify(cartListCopy));
        this.setState({
            shoppingCartEdited: true,
            openEdit: false
        });
    };

    handleDeleteShoppingCart = (cart: ICart) => {
        const {cartList} = this.props;
        let cartListCopy = [...cartList];
        cartListCopy = cartListCopy.filter(x => x.menu.id !== cart.menu.id);
        this.props.actions.setCartList(cartListCopy);
        localStorage.setItem("cartList", JSON.stringify(cartListCopy));
        this.setState({
            shoppingCartDeleted: true,
            openEdit: false
        });
    };

  handleValidateShoppingCart = async (selectedDate: string) => {
    try{
      await this.getServerTime();

      const { userId, cartList } = this.props;
      const { serverTime } = this.state;

      var startDate = moment(serverTime).subtract(2, 'hour');
      let endDate = moment(moment(selectedDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));

      if (startDate < endDate) {
        const menus = cartList.map(cart => {
          return {
            id: cart.menu.id,
            quantity: cart.quantity,
            remark: cart.remark,
            pricing: cart.menu.pricing,
            title: cart.menu.title,
            title_en: cart.menu.title_en,
            size: cart.menu.MenuSize ? cart.menu.MenuSize.title : "",
            size_en: cart.menu.MenuSize ? cart.menu.MenuSize.title_en : "",
            extras: cart.extras
          };
        });

        this.props.actions.addOrder(userId, menus, selectedDate);
        localStorage.setItem("cartList", JSON.stringify([]));

        this.setState({
          redirectTo: "/menus/success"
        });
      } else {
        this.setState({
          redirectTo: "/cart/toolate"
        });
      }
    }catch(e){
      alert('An error occured while validating cart');
    }
  };

    handleContinueShopping = () => {
        this.setState({redirectTo: "/menus"});
    };

    handleOpenEdit = (cart: ICart) => {
        this.setState({
            openEdit: true,
            editCart: cart
        });
    };

    handleCloseEdit = () => {
        this.setState({
            openEdit: false
        });
    };

    handleCloseSnackbarToolate = () => {
        this.setState({
            shoppingCartToolate: false
        });
    };

    handleCloseSnackbarAdded = () => {
        this.setState({
            shoppingCartAdded: false
        });
    };

    handleCloseSnackbarEdited = () => {
        this.setState({
            shoppingCartEdited: false
        });
    };

    handleCloseSnackbarDeleted = () => {
        this.setState({
            shoppingCartDeleted: false
        });
    };

    checkDictionnary = (tag: string) => {
        const {dictionnaryList, userLanguage} = this.props;
        return checkDictionnary(tag, dictionnaryList, userLanguage);
    };

    calculateTotalExtras = (extras: IExtra[]) => {
        let totalPricingArray = [];
        let totalPricing = 0;
        if (extras && extras.length > 0) {
            totalPricingArray = extras.map(extra => {
                return parseFloat(extra.pricing);
            });
            totalPricing = totalPricingArray.reduce(
                (a: number, b: number) => a + b,
                0
            );
        }
        return totalPricing;
    };

    calculateTotal = () => {
        const {cartList} = this.props;
        let totalPricingArray = [];
        let totalPricing = 0;
        if (cartList && cartList.length > 0) {
            totalPricingArray = cartList.map(cart => {
                return (
                    parseFloat(cart.menu.pricing) * cart.quantity +
                    cart.quantity * this.calculateTotalExtras(cart.extras)
                );
            });
            totalPricing = totalPricingArray.reduce(
                (a: number, b: number) => a + b,
                0
            );
        }
        return totalPricing;
    };

    isCartValidable = () => {
        const {userType, settingList} = this.props;
        if (userType === "administrator") {
            return true;
        }
        if (userType === "supplier") {
            return false;
        }
        if (settingList && settingList.length > 0) {
            const orderDate = moment().format("MM-DD-YYYY") + " " + settingList[0].time_limit;
            const startDate = moment(orderDate);
            const endDate = moment();
            return startDate.isSameOrAfter(endDate);
        }
        return false;
    };

    renderTimeLimitLabel = () => {
        const {settingList} = this.props;
        let text = "L'heure limite pour les commandes est : ";
        if (settingList && settingList.length > 0) {
            const orderDate = moment(settingList[0].time_limit, "HH:mm:ss").format(
                "HH:mm"
            );
            text = `${text}${orderDate}`;
        }
        return text;
    };

    renderPeriodSelect = () => {
        const {settingList} = this.props;
        if (settingList && settingList.length > 0) {
            return Array.from(Array(7).keys())
                .slice(
                    parseInt(settingList[0].start_period),
                    parseInt(settingList[0].end_period) + 1
                )
                .map(x => (
                    <MenuItem key={x} value={x}>
                        {moment().isoWeekday() - 1 === x && <>aujourd'hui</>}
                        {moment().isoWeekday() - 1 !== x && <>{moment.weekdays(true)[x]}</>}
                    </MenuItem>
                ));
        }
    };

    render() {
        const {
            shoppingCartAdded,
            shoppingCartToolate,
            shoppingCartEdited,
            shoppingCartDeleted,
            openEdit,
            editCart,
            redirectTo,
        } = this.state;
        const {
            isLoginSuccess,
            isListPending,
            userType,
            is_away,
            userLanguage,
            selected,
            cartList,
            settingList,
            orderListTotalCount,
            classes,
            match,
            serverTime
        } = this.props;
        if (!isLoginSuccess) {
            return <Navigate to="/login" replace />;
        }
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }
        return (
            <MenuBar
                isLoginSuccess={isLoginSuccess}
                isListPending={isListPending}
                userType={userType}
                cartItems={cartList ? cartList.length : 0}
                orderItems={orderListTotalCount || 0}
                selected={selected}
                title={this.checkDictionnary("_MON_PANIER")}
                onLogout={this.handleLogout}
                onChangeSelected={this.handleChangeSelected}
                checkDictionnary={this.checkDictionnary}
            >
                {shoppingCartToolate && match.params.id === "toolate" && (
                    <SnackbarAction
                        error
                        message={this.checkDictionnary("_HEURE_LIMITE_DEPASSEE")}
                        onClose={this.handleCloseSnackbarToolate}
                    />
                )}
                {shoppingCartAdded && match.params.id === "success" && (
                    <SnackbarAction
                        success
                        message={this.checkDictionnary("_MENU_BIEN_AJOUTE")}
                        onClose={this.handleCloseSnackbarAdded}
                    />
                )}
                {shoppingCartEdited && (
                    <SnackbarAction
                        success
                        message={this.checkDictionnary("_MENU_BIEN_MODIFIE")}
                        onClose={this.handleCloseSnackbarEdited}
                    />
                )}
                {shoppingCartDeleted && (
                    <SnackbarAction
                        success
                        message={this.checkDictionnary("_MENU_BIEN_SUPPRIME")}
                        onClose={this.handleCloseSnackbarDeleted}
                    />
                )}
                {openEdit && (
                    <EditCart
                        cart={editCart}
                        userLanguage={userLanguage}
                        onEditShoppingCart={this.handleEditShoppingCart}
                        onDeleteShoppingCart={this.handleDeleteShoppingCart}
                        onClose={this.handleCloseEdit}
                        checkDictionnary={this.checkDictionnary}
                    />
                )}
                <main className={classes.main}>
                    <div className={classNames(classes.layout, classes.cardGrid)}>
                        <div className={classNames(classes.heroUnit, "centered-text")}>
                            {!isListPending && (
                                <>
                                    <div className={classes.sectionDesktop}>
                                        <CartTable
                                            cartList={cartList.sort(menuSort)}
                                            readOnly={false}
                                            userType={userType}
                                            userLanguage={userLanguage}
                                            onEditShoppingCart={this.handleEditShoppingCart}
                                            onDeleteShoppingCart={this.handleDeleteShoppingCart}
                                            checkDictionnary={this.checkDictionnary}
                                        />
                                    </div>
                                    <div className={classes.sectionMobile}>
                                        <CartList
                                            cartList={cartList.sort(menuSort)}
                                            userLanguage={userLanguage}
                                            onOpenEdit={this.handleOpenEdit}
                                            checkDictionnary={this.checkDictionnary}
                                        />
                                    </div>
                                    {cartList && cartList.length > 0 && (
                                        <CartRecap
                                            totalPricing={this.calculateTotal()}
                                            userType={userType}
                                            is_away={is_away}
                                            cart_list={cartList}
                                            userLanguage={userLanguage}
                                            settingList={settingList}
                                            onValidateShoppingCart={this.handleValidateShoppingCart}
                                            onContinueShopping={this.handleContinueShopping}
                                            checkDictionnary={this.checkDictionnary}
                                            serverTime={this.props.serverTime}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
                <Footer/>
            </MenuBar>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Cart);
