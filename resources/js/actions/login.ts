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
import { Dispatch } from "redux";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

export interface LoginState {
  isLoginPending: boolean;
  isLoginSuccess: boolean;
  loginError: string;
}

export interface SetLoginPendingAction {
  type: typeof SET_LOGIN_PENDING;
  isLoginPending: boolean;
}

export interface SetLoginSuccessAction {
  type: typeof SET_LOGIN_SUCCESS;
  isLoginSuccess: boolean;
}

export interface SetLoginErrorAction {
  type: typeof SET_LOGIN_ERROR;
  loginError: string;
}

export type LoginAction =
  | SetLoginPendingAction
  | SetLoginSuccessAction
  | SetLoginErrorAction;

// types definition

export const SET_LOGIN_PENDING = "SET_LOGIN_PENDING";
export const SET_LOGIN_SUCCESS = "SET_LOGIN_SUCCESS";
export const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";

export const setLoginPending = (isLoginPending: boolean): SetLoginPendingAction => ({
  type: SET_LOGIN_PENDING,
  isLoginPending
});

export const setLoginSuccess = (isLoginSuccess: boolean): SetLoginSuccessAction => ({
  type: SET_LOGIN_SUCCESS,
  isLoginSuccess
});

export const setLoginError = (loginError: string): SetLoginErrorAction => ({
  type: SET_LOGIN_ERROR,
  loginError
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
  dispatch: Dispatch<LoginAction>
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

export const logout = () => (dispatch: Dispatch<LoginAction>) => {
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

export const register = (password: string, confirmPassword: string) => {
  return (dispatch: Dispatch<LoginAction>) => {
    dispatch(setLoginPending(true));
    // TODO: Implement register API call
    // For now, simulate a successful registration
    setTimeout(() => {
      dispatch(setLoginSuccess(true));
      dispatch(setLoginPending(false));
    }, 1000);
  };
};

export const resetPassword = (emailAddress: string) => {
  return (dispatch: Dispatch<LoginAction>) => {
    dispatch(setLoginPending(true));
    // TODO: Implement reset password API call
    // For now, simulate a successful password reset
    setTimeout(() => {
      dispatch(setLoginSuccess(true));
      dispatch(setLoginPending(false));
    }, 1000);
  };
};

export const editToken = (token: string) => {
  return (dispatch: Dispatch<LoginAction>) => {
    dispatch(setLoginPending(true));
    // TODO: Implement token edit API call
    // For now, simulate a successful token edit
    setTimeout(() => {
      dispatch(setLoginSuccess(true));
      dispatch(setLoginPending(false));
    }, 1000);
  };
};
