import ICart from "../interfaces/ICart";

// types declaration

type CartListAction = {
  type: "SET_CART_LIST";
  payload: ICart[];
};

export type CartAction = CartListAction;

// types definition

export const SET_CART_LIST = "SET_CART_LIST";
export const setCartList = (cartList: ICart[]) => ({
  type: SET_CART_LIST,
  payload: cartList
});
