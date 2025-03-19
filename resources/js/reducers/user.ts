import {
  SET_USER_ID,
  SET_USER_FIRST_NAME,
  SET_USER_LAST_NAME,
  SET_USER_LANGUAGE,
  SET_USER_TYPE,
  SET_USER_SUPPLIER_ID,
  SET_USER_EMAIL_ADDRESS,
  SET_USER_PASSWORD,
  SET_USER_TOKEN,
  SET_USER_LIST,
  SET_USER_VALIDITY,
  UserAction
} from "../actions/user";
import IUser from "../interfaces/IUser";

const initialState = {
  userId: -1,
  userFirstName: "",
  userLastName: "",
  userLanguage: "fr",
  userType: "",
  userSupplierId: -1,
  userEmailAddress: "",
  userPassword: "",
  userToken: "",
  userList: [],
  userValidity: ""
};

type State = {
  userId: number;
  userFirstName: string;
  userLastName: string;
  userLanguage: string;
  userType: string;
  userSupplierId: number;
  userEmailAddress: string;
  userPassword: string;
  userToken: string;
  userList: IUser[];
  userValidity: string;
};

const user = (state: State = initialState, action: UserAction) => {
  switch (action.type) {
    case SET_USER_ID:
      return Object.assign({}, state, {
        userId: action.payload
      });
    case SET_USER_FIRST_NAME:
      return Object.assign({}, state, {
        userFirstName: action.payload
      });
    case SET_USER_LAST_NAME:
      return Object.assign({}, state, {
        userLastName: action.payload
      });
    case SET_USER_LANGUAGE:
      return Object.assign({}, state, {
        userLanguage: action.payload
      });
    case SET_USER_TYPE:
      return Object.assign({}, state, {
        userType: action.payload
      });
    case SET_USER_SUPPLIER_ID:
      return Object.assign({}, state, {
        userSupplierId: action.payload
      });
    case SET_USER_EMAIL_ADDRESS:
      return Object.assign({}, state, {
        userEmailAddress: action.payload
      });
    case SET_USER_PASSWORD:
      return Object.assign({}, state, {
        userPassword: action.payload
      });
    case SET_USER_TOKEN:
      return Object.assign({}, state, {
        userToken: action.payload
      });
    case SET_USER_LIST:
      return Object.assign({}, state, {
        userList: action.payload.data
      });
    case SET_USER_VALIDITY:
      return Object.assign({}, state, {
        userValidity: action.payload.data
      });
    default:
      return state;
  }
};

export default user;
