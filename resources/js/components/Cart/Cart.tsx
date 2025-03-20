import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useParams } from "react-router-dom";
import moment, { Moment } from "moment";
import "moment/locale/en-gb";
import "moment/locale/fr";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../types/redux.d";
import { getDictionaries } from "../../actions/dictionnary";
import { getSettingList } from "../../actions/setting";
import { getOrdersForCustomer } from "../../actions/order";
import { getServerTime } from "../../actions/server_time";
import { logout } from "../../actions/login";
import { setSelected } from "../../actions/page";
import { setCartList } from "../../actions/cart";
import { addOrder } from "../../actions/order";

const HeroUnit = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

const Layout = styled('div')(({ theme }) => ({
  width: "auto",
  margin: "0 auto",
  padding: 0,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4)
  }
}));

const SectionDesktop = styled('div')(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const SectionMobile = styled('div')(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.up("md")]: {
    display: "none"
  }
}));

const Main = styled('main')({
  flex: 1
});

interface CartProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  is_away: boolean;
  userId: number;
  userToken: string;
  userLanguage: string;
  userType: string;
  selected: number;
  dictionnaryList: Array<{ tag: string; value: string; value_en: string }>;
  cartList: ICart[];
  settingList: ISetting[];
  orderListTotalCount: number;
  serverTime: string;
}

interface CartState {
  shoppingCartAdded: boolean;
  shoppingCartToolate: boolean;
  shoppingCartEdited: boolean;
  shoppingCartDeleted: boolean;
  openEdit: boolean;
  editCart: ICart | null;
  redirectTo: string;
  serverTime: string;
}

const Cart: React.FC<CartProps> = ({
  isLoginSuccess,
  isListPending,
  is_away,
  userId,
  userToken,
  userLanguage,
  userType,
  selected,
  dictionnaryList,
  cartList,
  settingList,
  orderListTotalCount,
  serverTime: initialServerTime
}): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<CartState>({
    shoppingCartAdded: true,
    shoppingCartToolate: true,
    shoppingCartEdited: false,
    shoppingCartDeleted: false,
    openEdit: false,
    editCart: null,
    redirectTo: "",
    serverTime: initialServerTime
  });

  const updateState = useCallback((updates: Partial<CartState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const timer = setInterval(tick, 60000);

    if (isLoginSuccess) {
      refreshData();
    }

    handleChangeSelected(2);
    moment.locale(userLanguage === "en" ? "en-gb" : "fr");
    avaSupp();

    return () => clearInterval(timer);
  }, [isLoginSuccess, userLanguage]);

  useEffect(() => {
    if (userToken) {
      refreshData();
    }
    if (userLanguage) {
      moment.locale(userLanguage === "fr" ? "fr" : "en-gb");
    }
  }, [userToken, userLanguage]);

  const avaSupp = async (): Promise<void> => {
    try {
      const res = await axios.get("/api/suppliers/list/");
      const supplierDB = res.data;
      const newCart: ICart[] = [];

      if (cartList.length) {
        supplierDB.forEach((sup: { id: number; away_start: string; away_end: string }) => {
          cartList.forEach((el) => {
            if (el.menu.supplier.id === sup.id) {
              el.menu.supplier.away_start = moment(sup.away_start);
              el.menu.supplier.away_end = moment(sup.away_end);
              newCart.push(el);
            }
          });
        });
      }

      localStorage.removeItem('cartList');
      localStorage.setItem("cartList", JSON.stringify(newCart.length ? newCart : []));
    } catch (error) {
      console.error("Error in avaSupp:", error);
    }
  };

  const tick = async (): Promise<void> => {
    try {
      const res = await axios.get("/api/users/check_validity", { withCredentials: true });
      if (res.data === "not valid") {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Error in tick:", error);
    }
  };

  const refreshData = async (): Promise<void> => {
    await tick();
    await dispatch(getDictionaries());
    await dispatch(getSettingList());
    await dispatch(getOrdersForCustomer());
    try {
      const resultAction = await dispatch(getServerTime());
      const { currentTime } = resultAction.payload;
      if (currentTime) {
        updateState({ serverTime: currentTime.format() });
      }
    } catch (error) {
      console.error("Error getting server time:", error);
    }
  };

  const handleLogout = (): void => {
    dispatch(logout());
  };

  const handleChangeSelected = async (selected: number): Promise<void> => {
    dispatch(setSelected(selected));
    localStorage.setItem("selected", selected.toString());
    try {
      const resultAction = await dispatch(getServerTime());
      const { currentTime } = resultAction.payload;
      if (currentTime) {
        updateState({ serverTime: currentTime.format() });
      }
    } catch (error) {
      console.error("Error getting server time:", error);
    }
  };

  const handleEditShoppingCart = (cart: ICart, quantity: number, remark: string): void => {
    if (isNaN(quantity)) return;

    const cartListCopy = [...cartList];
    const exist = cartListCopy.filter(x => x.menu.id === cart.menu.id);
    
    if (exist.length > 0) {
      exist[0].quantity = quantity;
      exist[0].remark = remark;
      const newCartList = cartListCopy.filter(x => x.menu.id !== cart.menu.id);
      newCartList.push(exist[0]);
      dispatch(setCartList(newCartList));
      localStorage.setItem("cartList", JSON.stringify(newCartList));
      updateState({ 
        shoppingCartEdited: true,
        openEdit: false
      });
    }
  };

  const handleDeleteShoppingCart = (cart: ICart): void => {
    const cartListCopy = cartList.filter(x => x.menu.id !== cart.menu.id);
    dispatch(setCartList(cartListCopy));
    localStorage.setItem("cartList", JSON.stringify(cartListCopy));
    updateState({ 
      shoppingCartDeleted: true,
      openEdit: false
    });
  };

  const handleValidateShoppingCart = async (selectedDate: string): Promise<void> => {
    try {
      const resultAction = await dispatch(getServerTime());
      const { currentTime } = resultAction.payload;
      if (currentTime) {
        updateState({ serverTime: currentTime.format() });
      }

      const startDate: Moment = moment(state.serverTime).subtract(2, 'hour');
      const endDate: Moment = moment(moment(selectedDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));

      if (startDate.isBefore(endDate)) {
        const menus = cartList.map(cart => ({
          id: cart.menu.id,
          quantity: cart.quantity,
          remark: cart.remark,
          pricing: cart.menu.pricing,
          title: cart.menu.title,
          title_en: cart.menu.menu_size?.title_en || "",
          size: cart.menu.menu_size?.title || "",
          size_en: cart.menu.menu_size?.title_en || "",
          extras: cart.extras
        }));

        await dispatch(addOrder(userId, menus, selectedDate));
        localStorage.setItem("cartList", JSON.stringify([]));
        updateState({ redirectTo: "/menus/success" });
      } else {
        updateState({ redirectTo: "/cart/toolate" });
      }
    } catch (error) {
      console.error("Error validating cart:", error);
      alert('An error occurred while validating cart');
    }
  };

  const handleContinueShopping = (): void => {
    updateState({ redirectTo: "/menus" });
  };

  const handleOpenEdit = (cart: ICart): void => {
    updateState({ 
      openEdit: true,
      editCart: cart
    });
  };

  const handleCloseEdit = (): void => {
    updateState({ openEdit: false });
  };

  const handleCloseSnackbar = (key: keyof CartState): void => {
    updateState({ [key]: false });
  };

  const checkDictionnaryValue = (tag: string): string => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  const calculateTotalExtras = (extras: IExtra[]): number => {
    if (!extras?.length) return 0;
    return extras.reduce((total, extra) => total + parseFloat(extra.pricing), 0);
  };

  const calculateTotal = (): number => {
    if (!cartList?.length) return 0;
    return cartList.reduce((total, cart) => {
      return total + (
        Number(cart.menu.pricing) * cart.quantity +
        cart.quantity * calculateTotalExtras(cart.extras)
      );
    }, 0);
  };

  const isCartValidable = (): boolean => {
    if (userType === "administrator") return true;
    if (userType === "supplier") return false;
    
    if (settingList?.length > 0) {
      const orderDate = moment().format("MM-DD-YYYY") + " " + settingList[0].time_limit;
      const startDate = moment(orderDate);
      const endDate = moment();
      return startDate.isSameOrAfter(endDate);
    }
    return false;
  };

  const renderTimeLimitLabel = (): string => {
    let text = "L'heure limite pour les commandes est : ";
    if (settingList?.length > 0) {
      const orderDate = moment(settingList[0].time_limit, "HH:mm:ss").format("HH:mm");
      text = `${text}${orderDate}`;
    }
    return text;
  };

  const renderPeriodSelect = (): JSX.Element[] | undefined => {
    if (settingList?.length > 0) {
      return Array.from(Array(7).keys())
        .slice(
          parseInt(settingList[0].start_period),
          parseInt(settingList[0].end_period) + 1
        )
        .map(x => (
          <MenuItem key={x} value={x}>
            {moment().isoWeekday() - 1 === x ? "aujourd'hui" : moment.weekdays(true)[x]}
          </MenuItem>
        ));
    }
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }

  if (state.redirectTo) {
    return <Navigate to={state.redirectTo} replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      cartItems={cartList?.length || 0}
      orderItems={orderListTotalCount || 0}
      selected={selected}
      title={checkDictionnaryValue("_MON_PANIER")}
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={checkDictionnaryValue}
    >
      {state.shoppingCartToolate && id === "toolate" && (
        <SnackbarAction
          error
          message={checkDictionnaryValue("_HEURE_LIMITE_DEPASSEE")}
          onClose={() => handleCloseSnackbar('shoppingCartToolate')}
        />
      )}
      {state.shoppingCartAdded && id === "success" && (
        <SnackbarAction
          success
          message={checkDictionnaryValue("_MENU_BIEN_AJOUTE")}
          onClose={() => handleCloseSnackbar('shoppingCartAdded')}
        />
      )}
      {state.shoppingCartEdited && (
        <SnackbarAction
          success
          message={checkDictionnaryValue("_MENU_BIEN_MODIFIE")}
          onClose={() => handleCloseSnackbar('shoppingCartEdited')}
        />
      )}
      {state.shoppingCartDeleted && (
        <SnackbarAction
          success
          message={checkDictionnaryValue("_MENU_BIEN_SUPPRIME")}
          onClose={() => handleCloseSnackbar('shoppingCartDeleted')}
        />
      )}
      {state.openEdit && state.editCart && (
        <EditCart
          cart={state.editCart}
          userLanguage={userLanguage}
          onEditShoppingCart={handleEditShoppingCart}
          onDeleteShoppingCart={handleDeleteShoppingCart}
          onClose={handleCloseEdit}
          checkDictionnary={checkDictionnaryValue}
        />
      )}
      <Main>
        <Layout>
          <HeroUnit className="centered-text">
            {!isListPending && (
              <>
                <SectionDesktop>
                  <CartTable
                    cartList={cartList.sort(menuSort)}
                    readOnly={false}
                    userType={userType}
                    userLanguage={userLanguage}
                    onEditShoppingCart={handleEditShoppingCart}
                    onDeleteShoppingCart={handleDeleteShoppingCart}
                    checkDictionnary={checkDictionnaryValue}
                  />
                </SectionDesktop>
                <SectionMobile>
                  <CartList
                    cartList={cartList.sort(menuSort)}
                    userLanguage={userLanguage}
                    onOpenEdit={handleOpenEdit}
                    checkDictionnary={checkDictionnaryValue}
                  />
                </SectionMobile>
                {cartList?.length > 0 && (
                  <CartRecap
                    totalPricing={calculateTotal()}
                    userType={userType}
                    is_away={is_away}
                    cart_list={cartList}
                    userLanguage={userLanguage}
                    settingList={settingList}
                    onValidateShoppingCart={handleValidateShoppingCart}
                    onContinueShopping={handleContinueShopping}
                    checkDictionnary={checkDictionnaryValue}
                    serverTime={state.serverTime}
                  />
                )}
              </>
            )}
          </HeroUnit>
        </Layout>
      </Main>
      <Footer />
    </MenuBar>
  );
};

export default Cart;
