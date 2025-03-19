import axios from "axios";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";
import { Dispatch } from "redux";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

export interface UserState {
  id: number;
  firstName: string;
  lastName: string;
  language: string;
  type: string;
  supplierId: number;
  emailAddress: string;
  password: string;
  token: string;
  validity: string;
}

export interface UserIdAction {
  type: typeof SET_USER_ID;
  id: number;
}

export interface UserFirstNameAction {
  type: typeof SET_USER_FIRST_NAME;
  firstName: string;
}

export interface UserLastNameAction {
  type: typeof SET_USER_LAST_NAME;
  lastName: string;
}

export interface UserLanguageAction {
  type: typeof SET_USER_LANGUAGE;
  language: string;
}

export interface UserTypeAction {
  type: typeof SET_USER_TYPE;
  userType: string;
}

export interface UserSupplierIdAction {
  type: typeof SET_USER_SUPPLIER_ID;
  supplierId: number;
}

export interface UserEmailAddressAction {
  type: typeof SET_USER_EMAIL_ADDRESS;
  emailAddress: string;
}

export interface UserPasswordAction {
  type: typeof SET_USER_PASSWORD;
  password: string;
}

export interface UserTokenAction {
  type: typeof SET_USER_TOKEN;
  token: string;
}

export interface UserValidityAction {
  type: typeof SET_USER_VALIDITY;
  validity: string;
}

export type UserAction =
  | UserIdAction
  | UserFirstNameAction
  | UserLastNameAction
  | UserLanguageAction
  | UserTypeAction
  | UserSupplierIdAction
  | UserEmailAddressAction
  | UserPasswordAction
  | UserTokenAction
  | UserValidityAction;

// types definition

export const SET_USER_ID = "SET_USER_ID";
export const SET_USER_FIRST_NAME = "SET_USER_FIRST_NAME";
export const SET_USER_LAST_NAME = "SET_USER_LAST_NAME";
export const SET_USER_LANGUAGE = "SET_USER_LANGUAGE";
export const SET_USER_TYPE = "SET_USER_TYPE";
export const SET_USER_SUPPLIER_ID = "SET_USER_SUPPLIER_ID";
export const SET_USER_EMAIL_ADDRESS = "SET_USER_EMAIL_ADDRESS";
export const SET_USER_PASSWORD = "SET_USER_PASSWORD";
export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const SET_USER_VALIDITY = "SET_USER_VALIDITY";

export const setUserId = (id: number): UserIdAction => ({
  type: SET_USER_ID,
  id
});

export const setUserFirstName = (firstName: string): UserFirstNameAction => ({
  type: SET_USER_FIRST_NAME,
  firstName
});

export const setUserLastName = (lastName: string): UserLastNameAction => ({
  type: SET_USER_LAST_NAME,
  lastName
});

export const setUserLanguage = (language: string): UserLanguageAction => ({
  type: SET_USER_LANGUAGE,
  language
});

export const setUserType = (userType: string): UserTypeAction => ({
  type: SET_USER_TYPE,
  userType
});

export const setUserSupplierId = (supplierId: number): UserSupplierIdAction => ({
  type: SET_USER_SUPPLIER_ID,
  supplierId
});

export const setUserEmailAddress = (emailAddress: string): UserEmailAddressAction => ({
  type: SET_USER_EMAIL_ADDRESS,
  emailAddress
});

export const setUserPassword = (password: string): UserPasswordAction => ({
  type: SET_USER_PASSWORD,
  password
});

export const setUserToken = (token: string): UserTokenAction => ({
  type: SET_USER_TOKEN,
  token
});

export const setUserValidity = (validity: string): UserValidityAction => ({
  type: SET_USER_VALIDITY,
  validity
});

export const SET_USER_LIST = "SET_USER_LIST";
export const setUserList = (userList: any) => ({
  type: SET_USER_LIST,
  payload: userList
});

// user

export const userDispatch = (userData: any, userToken: string, emailAddress: string, password: string) => {
  return (dispatch: any) => {
    dispatch(setUserId(userData.id));
    dispatch(setUserFirstName(userData.first_name));
    dispatch(setUserLastName(userData.last_name));
    dispatch(setUserLanguage(userData.language));
    dispatch(setUserType(userData.type));
    dispatch(setUserSupplierId(userData.supplier_id));
    dispatch(setUserEmailAddress(emailAddress));
    dispatch(setUserPassword(password));
    dispatch(setUserToken(userToken));
    dispatch(setUserValidity("valid"));

    const user = {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      language: userData.language,
      type: userData.type,
      supplierId: userData.supplier_id,
      emailAddress,
      password,
      token: userToken,
      validity: "valid"
    };

    localStorage.setItem("user", JSON.stringify(user));
  };
};

function addUserDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add user failed!"));
    } else {
      dispatch(getUsers());
    }
  };
}

export const addUser = (
  firstName: string,
  lastName: string,
  emailAddress: string,
  type: string,
  supplierId: number,
  language: string
) => (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/users/add/`, {
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language
    })
    .then(res => dispatch(addUserDispatch(res)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function editUserDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit user failed!"));
    } else {
      dispatch(getUsers());
    }
  };
}

export const editUser = (
  id: number,
  firstName: string,
  lastName: string,
  emailAddress: string,
  type: string,
  supplierId: number,
  language: string,
  resetPassword: boolean
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/users/edit/${id}`, {
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language,
      resetPassword
    })
    .then(res => dispatch(editUserDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteUserDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete user failed!"));
    } else {
      dispatch(getUsers());
    }
  };
}

export const deleteUser = (id: number) => (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/users/delete/${id}`, {})
    .then((res: any) => dispatch(deleteUserDispatch(res)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function editUserLanguageDispatch(res: any, language: string) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setListError("Edit user language failed!"));
    } else {
      dispatch(setUserLanguage(language));
    }
  };
}

export const editUserLanguage = (language: string) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/users/edit_language/`, { language })
    .then((res: any) => dispatch(editUserLanguageDispatch(res, language)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function registerDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setListError("Register user failed!"));
    }
  };
}

export const register = (password: string, confirmPassword: string) => (
  dispatch: Function
) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/users/register/`, {
      password,
      confirmPassword
    })
    .then((res: any) => dispatch(registerDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function resetPasswordDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setListError("Reset password user failed!"));
    }
  };
}

export const resetPassword = (emailAddress: string) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/users/resetPassword/`, {
      emailAddress
    })
    .then((res: any) => dispatch(resetPasswordDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

export const editToken = (token: string) => (dispatch: Function) => {
  axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  dispatch(setUserToken(token));
};

function getUsersDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List users failed!"));
    }
  };
}

export const getUsers = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const userList = axios.get(`/api/users/list/`, {});
  dispatch(setUserList(userList))
    .then((res: any) => dispatch(getUsersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getCustomersDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List customers failed!"));
    }
  };
}

export const getCustomers = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const userList = axios.get(`/api/users/list_customers/`, {});
  dispatch(setUserList(userList))
    .then((res: any) => dispatch(getCustomersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

export const checkUserValidity = () => {
  return async (dispatch: any) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/users/check_validity",
        withCredentials: true
      });
      dispatch(setUserValidity(response.data));
    } catch (error) {
      dispatch(setUserValidity("not valid"));
    }
  };
};
