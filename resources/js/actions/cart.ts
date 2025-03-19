import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../types/redux';
import ICart from "../interfaces/ICart";

export interface CartState {
  list: ICart[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CartState = {
  list: [],
  isLoading: false,
  error: null,
  success: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartList: (state, action: PayloadAction<ICart[]>) => {
      state.list = action.payload;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCartSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetCartState: (state) => {
      Object.assign(state, initialState);
    },
    addToCart: (state, action: PayloadAction<ICart>) => {
      state.list.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((_, index) => index !== action.payload);
    },
    updateCartItem: (state, action: PayloadAction<{ index: number; item: ICart }>) => {
      const { index, item } = action.payload;
      if (index >= 0 && index < state.list.length) {
        state.list[index] = item;
      }
    },
    clearCart: (state) => {
      state.list = [];
    }
  }
});

export const {
  setCartList,
  setCartLoading,
  setCartError,
  setCartSuccess,
  resetCartState,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} = cartSlice.actions;

// Action thunk pour mettre à jour le panier
export const cartDispatch = (cartData: CartState) => (dispatch: AppDispatch) => {
  dispatch(setCartList(cartData.list));
};

// Action thunk pour ajouter un article au panier
export const addItemToCart = (item: ICart) => (dispatch: AppDispatch) => {
  dispatch(addToCart(item));
};

// Action thunk pour supprimer un article du panier
export const removeItemFromCart = (index: number) => (dispatch: AppDispatch) => {
  dispatch(removeFromCart(index));
};

// Action thunk pour mettre à jour un article du panier
export const updateItemInCart = (index: number, item: ICart) => (dispatch: AppDispatch) => {
  dispatch(updateCartItem({ index, item }));
};

export default cartSlice.reducer;
