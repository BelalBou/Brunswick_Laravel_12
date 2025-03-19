import { store } from '../index';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Types pour les actions de login
export type SetLoginPendingAction = {
  type: 'SET_LOGIN_PENDING';
  payload: boolean;
};

export type SetLoginSuccessAction = {
  type: 'SET_LOGIN_SUCCESS';
  payload: boolean;
};

export type SetLoginErrorAction = {
  type: 'SET_LOGIN_ERROR';
  payload: string;
};

// Types pour les actions utilisateur
export type SetUserIdAction = {
  type: 'SET_USER_ID';
  payload: string | number;
};

export type SetUserFirstNameAction = {
  type: 'SET_USER_FIRST_NAME';
  payload: string;
};

export type SetUserLastNameAction = {
  type: 'SET_USER_LAST_NAME';
  payload: string;
};

export type SetUserLanguageAction = {
  type: 'SET_USER_LANGUAGE';
  payload: string;
};

export type SetUserTypeAction = {
  type: 'SET_USER_TYPE';
  payload: string;
};

export type SetUserSupplierIdAction = {
  type: 'SET_USER_SUPPLIER_ID';
  payload: string | number;
};

export type SetUserEmailAddressAction = {
  type: 'SET_USER_EMAIL_ADDRESS';
  payload: string;
};

export type SetUserPasswordAction = {
  type: 'SET_USER_PASSWORD';
  payload: string;
};

export type SetUserTokenAction = {
  type: 'SET_USER_TOKEN';
  payload: string;
};

export type SetCartListAction = {
  type: 'SET_CART_LIST';
  payload: any[]; // Remplacer 'any' par le type correct de votre panier
};

export type SetSelectedAction = {
  type: 'SET_SELECTED';
  payload: number;
};

export type RootAction =
  | SetLoginPendingAction
  | SetLoginSuccessAction
  | SetLoginErrorAction
  | SetUserIdAction
  | SetUserFirstNameAction
  | SetUserLastNameAction
  | SetUserLanguageAction
  | SetUserTypeAction
  | SetUserSupplierIdAction
  | SetUserEmailAddressAction
  | SetUserPasswordAction
  | SetUserTokenAction
  | SetCartListAction
  | SetSelectedAction; 