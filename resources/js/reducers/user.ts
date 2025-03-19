import {
  UserState,
  UserAction,
  SET_USER_ID,
  SET_USER_FIRST_NAME,
  SET_USER_LAST_NAME,
  SET_USER_LANGUAGE,
  SET_USER_TYPE,
  SET_USER_SUPPLIER_ID,
  SET_USER_EMAIL_ADDRESS,
  SET_USER_PASSWORD,
  SET_USER_TOKEN,
  SET_USER_VALIDITY
} from "../actions/user";
import IUser from "../interfaces/IUser";

const initialState: UserState = {
  id: -1,
  firstName: "",
  lastName: "",
  language: "fr",
  type: "",
  supplierId: -1,
  emailAddress: "",
  password: "",
  token: "",
  validity: "valid"
};

export default function user(state = initialState, action: UserAction): UserState {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        id: action.id
      };
    case SET_USER_FIRST_NAME:
      return {
        ...state,
        firstName: action.firstName
      };
    case SET_USER_LAST_NAME:
      return {
        ...state,
        lastName: action.lastName
      };
    case SET_USER_LANGUAGE:
      return {
        ...state,
        language: action.language
      };
    case SET_USER_TYPE:
      return {
        ...state,
        type: action.userType
      };
    case SET_USER_SUPPLIER_ID:
      return {
        ...state,
        supplierId: action.supplierId
      };
    case SET_USER_EMAIL_ADDRESS:
      return {
        ...state,
        emailAddress: action.emailAddress
      };
    case SET_USER_PASSWORD:
      return {
        ...state,
        password: action.password
      };
    case SET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case SET_USER_VALIDITY:
      return {
        ...state,
        validity: action.validity
      };
    default:
      return state;
  }
}
