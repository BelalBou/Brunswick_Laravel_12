import { SET_CART_LIST, CartAction } from "../actions/cart";
import ICart from "../interfaces/ICart";

const initialState = {
  cartList: []
};

type State = {
  cartList: ICart[];
};

const cart = (state: State = initialState, action: CartAction) => {
  switch (action.type) {
    case SET_CART_LIST:
      return Object.assign({}, state, {
        cartList: action.payload
      });
    default:
      return state;
  }
};

export default cart;
