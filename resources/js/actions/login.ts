import axios from "axios";
import {
  userDispatch,
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken
} from "./user";
import { setSelected } from "./page";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type LoginPendingAction = {
  type: "SET_LOGIN_PENDING";
  payload: boolean;
};

type LoginSuccessAction = {
  type: "SET_LOGIN_SUCCESS";
  payload: boolean;
};

type LoginErrorAction = {
  type: "SET_LOGIN_ERROR";
  payload: string;
};

export type LoginAction =
  | LoginPendingAction
  | LoginSuccessAction
  | LoginErrorAction;

// types definition

export const SET_LOGIN_PENDING = "SET_LOGIN_PENDING";
export const setLoginPending = (isLoginPending: boolean) => ({
  type: SET_LOGIN_PENDING,
  payload: isLoginPending
});

export const SET_LOGIN_SUCCESS = "SET_LOGIN_SUCCESS";
export const setLoginSuccess = (isLoginSuccess: boolean) => ({
  type: SET_LOGIN_SUCCESS,
  payload: isLoginSuccess
});

export const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
export const setLoginError = (loginError: string) => ({
  type: SET_LOGIN_ERROR,
  payload: loginError
});

// login

function loginDispatch(res: any, emailAddress: string, password: string) {
  return (dispatch: Function) => {
    dispatch(setLoginSuccess(!!res.data.length));
    if (!res.data.length) {
      dispatch(setLoginError("Login failed!"));
    } else {
      const userToken =
        res.data.length > 1 && res.data[1] && res.data[1].token
          ? res.data[1].token
          : "";
      dispatch(userDispatch(res.data[0], userToken, emailAddress, password));
    }
  };
}

export const login = (emailAddress: string, password: string) => (
  dispatch: Function
) => {
  dispatch(setLoginPending(true));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));
  axios
    .post(`/api/users/login/`, {
      emailAddress,
      password
    })
    .then(res => dispatch(loginDispatch(res, emailAddress, password)))
    .catch((err: string) => dispatch(setLoginError(err)))
    .then(() => dispatch(setLoginPending(false)));
};

export const logout = () => (dispatch: Function) => {
  dispatch(setLoginPending(false));
  dispatch(setLoginSuccess(false));
  dispatch(setLoginError(""));
  dispatch(setUserId(-1));
  dispatch(setUserFirstName(""));
  dispatch(setUserLastName(""));
  dispatch(setUserLanguage("fr"));
  dispatch(setUserType(""));
  dispatch(setUserSupplierId(-1));
  dispatch(setUserEmailAddress(""));
  dispatch(setUserPassword(""));
  dispatch(setUserToken(""));
  dispatch(setSelected(1));
  localStorage.clear();
};
