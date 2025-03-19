import { LoginAction, LoginState } from "../actions/login";
import { UserAction, UserState } from "../actions/user";
import { CartAction, CartState } from "../actions/cart";
import { PageAction, PageState } from "../actions/page";
import { AddAction, AddState } from "../actions/add";
import { AllergyAction, AllergyState } from "../actions/allergy";
import { CategoryAction, CategoryState } from "../actions/category";
import { DailyMailAction, DailyMailState } from "../actions/daily_mail";
import { DeleteAction, DeleteState } from "../actions/delete";
import { DictionnaryAction, DictionnaryState } from "../actions/dictionnary";
import { EditAction, EditState } from "../actions/edit";
import { ExtraAction, ExtraState } from "../actions/extra";
import { ListAction, ListState } from "../actions/list";
import { MenuAction, MenuState } from "../actions/menu";
import { MenuSizeAction, MenuSizeState } from "../actions/menu_size";
import { OrderAction, OrderState } from "../actions/order";
import { ServerTimeAction, ServerTimeState } from "../actions/server_time";
import { SettingAction, SettingState } from "../actions/setting";
import { SupplierAction, SupplierState } from "../actions/supplier";
import { store } from "../store";
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

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

// Types du store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// Types des actions
export type RootAction =
  | LoginAction
  | UserAction
  | CartAction
  | PageAction
  | AddAction
  | AllergyAction
  | CategoryAction
  | DailyMailAction
  | DeleteAction
  | DictionnaryAction
  | EditAction
  | ExtraAction
  | ListAction
  | MenuAction
  | MenuSizeAction
  | OrderAction
  | ServerTimeAction
  | SettingAction
  | SupplierAction
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