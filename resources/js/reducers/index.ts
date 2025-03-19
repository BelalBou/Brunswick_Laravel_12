import { combineReducers } from "redux";
import { LoginState, LoginAction } from "../actions/login";
import { UserState, UserAction } from "../actions/user";
import { CartState, CartAction } from "../actions/cart";
import { PageState, PageAction } from "../actions/page";

export interface RootState {
  login: LoginState;
  user: UserState;
  cart: CartState;
  page: PageState;
}

export type RootAction = LoginAction | UserAction | CartAction | PageAction;

const loginReducer = (state: LoginState = {
  isLoginPending: false,
  isLoginSuccess: false,
  loginError: ""
}, action: LoginAction): LoginState => {
  switch (action.type) {
    case "SET_LOGIN_PENDING":
      return { ...state, isLoginPending: action.payload };
    case "SET_LOGIN_SUCCESS":
      return { ...state, isLoginSuccess: action.payload };
    case "SET_LOGIN_ERROR":
      return { ...state, loginError: action.payload };
    default:
      return state;
  }
};

const userReducer = (state: UserState = {
  id: 0,
  firstName: "",
  lastName: "",
  language: "",
  type: "",
  supplierId: 0,
  emailAddress: "",
  password: "",
  token: ""
}, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, id: action.payload };
    case "SET_USER_FIRST_NAME":
      return { ...state, firstName: action.payload };
    case "SET_USER_LAST_NAME":
      return { ...state, lastName: action.payload };
    case "SET_USER_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_USER_TYPE":
      return { ...state, type: action.payload };
    case "SET_USER_SUPPLIER_ID":
      return { ...state, supplierId: action.payload };
    case "SET_USER_EMAIL_ADDRESS":
      return { ...state, emailAddress: action.payload };
    case "SET_USER_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_USER_TOKEN":
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

const cartReducer = (state: CartState = {
  list: []
}, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART_LIST":
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

const pageReducer = (state: PageState = {
  selected: 0
}, action: PageAction): PageState => {
  switch (action.type) {
    case "SET_SELECTED":
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};

export default combineReducers<RootState>({
  login: loginReducer,
  user: userReducer,
  cart: cartReducer,
  page: pageReducer
});
