import axios from "axios";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type UserIdAction = {
  type: "SET_USER_ID";
  payload: number;
};

type UserFirstNameAction = {
  type: "SET_USER_FIRST_NAME";
  payload: string;
};

type UserLastNameAction = {
  type: "SET_USER_LAST_NAME";
  payload: string;
};

type UserLanguageAction = {
  type: "SET_USER_LANGUAGE";
  payload: string;
};

type UserTypeAction = {
  type: "SET_USER_TYPE";
  payload: string;
};

type UserSupplierIdAction = {
  type: "SET_USER_SUPPLIER_ID";
  payload: number;
};

type UserEmailAddressAction = {
  type: "SET_USER_EMAIL_ADDRESS";
  payload: string;
};

type UserPasswordAction = {
  type: "SET_USER_PASSWORD";
  payload: string;
};

type UserTokenAction = {
  type: "SET_USER_TOKEN";
  payload: string;
};

type UserListAction = {
  type: "SET_USER_LIST";
  payload: any;
};

type UserValidityAction = {
  type: "SET_USER_VALIDITY";
  payload: any;
};

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
  | UserListAction
  | UserValidityAction;

// types definition

export const SET_USER_ID = "SET_USER_ID";
export const setUserId = (userId: number) => ({
  type: SET_USER_ID,
  payload: userId
});

export const SET_USER_FIRST_NAME = "SET_USER_FIRST_NAME";
export const setUserFirstName = (userFirstName: string) => ({
  type: SET_USER_FIRST_NAME,
  payload: userFirstName
});

export const SET_USER_LAST_NAME = "SET_USER_LAST_NAME";
export const setUserLastName = (userLastName: string) => ({
  type: SET_USER_LAST_NAME,
  payload: userLastName
});

export const SET_USER_LANGUAGE = "SET_USER_LANGUAGE";
export const setUserLanguage = (userLanguage: string) => ({
  type: SET_USER_LANGUAGE,
  payload: userLanguage
});

export const SET_USER_TYPE = "SET_USER_TYPE";
export const setUserType = (userType: string) => ({
  type: SET_USER_TYPE,
  payload: userType
});

export const SET_USER_SUPPLIER_ID = "SET_USER_SUPPLIER_ID";
export const setUserSupplierId = (supplierId: number) => ({
  type: SET_USER_SUPPLIER_ID,
  payload: supplierId
});

export const SET_USER_EMAIL_ADDRESS = "SET_USER_EMAIL_ADDRESS";
export const setUserEmailAddress = (userEmailAddress: string) => ({
  type: SET_USER_EMAIL_ADDRESS,
  payload: userEmailAddress
});

export const SET_USER_PASSWORD = "SET_USER_PASSWORD";
export const setUserPassword = (userPassword: string) => ({
  type: SET_USER_PASSWORD,
  payload: userPassword
});

export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const setUserToken = (userToken: string) => ({
  type: SET_USER_TOKEN,
  payload: userToken
});

export const SET_USER_LIST = "SET_USER_LIST";
export const setUserList = (userList: any) => ({
  type: SET_USER_LIST,
  payload: userList
});

export const SET_USER_VALIDITY = "SET_USER_VALIDITY";
export const setUserValidity = (userValidity: any) => ({
  type: SET_USER_VALIDITY,
  payload: userValidity
});

// user

export function userDispatch(
  user: any,
  userToken: string,
  emailAddress: string,
  password: string
) {
  return (dispatch: Function) => {
    dispatch(setUserId(user.id));
    dispatch(setUserFirstName(user.first_name));
    dispatch(setUserLastName(user.last_name));
    dispatch(setUserLanguage(user.language));
    dispatch(setUserType(user.type));
    dispatch(setUserSupplierId(user.supplier_id));
    dispatch(setUserEmailAddress(emailAddress));
    dispatch(setUserPassword(password));
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        language: user.language,
        type: user.type,
        supplierId: user.supplier_id,
        emailAddress,
        password,
        token: userToken
      })
    );
    axios.defaults.headers.common["authorization"] = `Bearer ${userToken}`;
    dispatch(setUserToken(userToken));
  };
}

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

function checkUserValidityDispatch(res: any) {
  return (dispatch: Function) => {
    if (!res.payload.data) {
      dispatch(setListError("Check user validity failed!"));
    }
  };
}

export const checkUserValidity = () => (dispatch: Function) => {
  dispatch(setListError(""));
  const userValidity = axios.get(`/api/users/check_validity/`, {});
  dispatch(setUserValidity(userValidity))
    .then((res: any) => dispatch(checkUserValidityDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)));
};
