import {
  SET_LOGIN_PENDING,
  SET_LOGIN_SUCCESS,
  SET_LOGIN_ERROR,
  LoginAction
} from "../actions/login";

const initialState = {
  isLoginPending: false,
  isLoginSuccess: false,
  loginError: ""
};

type State = {
  isLoginPending: boolean;
  isLoginSuccess: boolean;
  loginError: string;
};

const login = (state: State = initialState, action: LoginAction) => {
  switch (action.type) {
    case SET_LOGIN_PENDING:
      return Object.assign({}, state, {
        isLoginPending: action.payload
      });
    case SET_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoginSuccess: action.payload
      });
    case SET_LOGIN_ERROR:
      return Object.assign({}, state, {
        loginError: action.payload
      });
    default:
      return state;
  }
};

export default login;
