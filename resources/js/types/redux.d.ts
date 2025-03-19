import { LoginAction, LoginState } from "../actions/login";
import { UserAction, UserState } from "../actions/user";
import { CartAction, CartState } from "../actions/cart";
import { PageAction, PageState } from "../actions/page";
import { ListAction, ListState } from "../actions/list";
import { EditAction, EditState } from "../actions/edit";
import { DictionnaryAction, DictionnaryState } from "../actions/dictionnary";
import { OrderAction, OrderState } from "../actions/order";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";

export interface RootState {
  login: LoginState;
  user: UserState;
  cart: CartState;
  page: PageState;
  list: ListState;
  edit: EditState;
  dictionnary: DictionnaryState;
  order: OrderState;
}

export type RootAction =
  | LoginAction
  | UserAction
  | CartAction
  | PageAction
  | ListAction
  | EditAction
  | DictionnaryAction
  | OrderAction;

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>; 