import { Dispatch } from "redux";
import ICart from "../interfaces/ICart";

export interface CartState {
  list: ICart[];
}

export interface CartListAction {
  type: "SET_CART_LIST";
  payload: ICart[];
}

export type CartAction = CartListAction;

export const setCartList = (list: ICart[]): CartListAction => ({
  type: "SET_CART_LIST",
  payload: list
});

export const cartDispatch = (cartData: CartState) => (dispatch: Dispatch<CartAction>) => {
  dispatch(setCartList(cartData.list));
};
