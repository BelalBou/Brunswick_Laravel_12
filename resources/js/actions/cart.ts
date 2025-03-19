import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
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

// Action thunk pour valider le panier
export const validateCart = createAsyncThunk(
  'cart/validateCart',
  async (cartData: ICart[], { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      dispatch(setCartSuccess(false));

      const response = await axios.post('/api/cart/validate', { items: cartData });
      
      if (response.data) {
        dispatch(setCartSuccess(true));
        dispatch(clearCart());
        return response.data;
      } else {
        dispatch(setCartError('Cart validation failed'));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during cart validation';
      dispatch(setCartError(errorMessage));
      return null;
    } finally {
      dispatch(setCartLoading(false));
    }
  }
);

// Action thunk pour sauvegarder le panier
export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (cartData: ICart[], { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));
      dispatch(setCartSuccess(false));

      const response = await axios.post('/api/cart/save', { items: cartData });
      
      if (response.data) {
        dispatch(setCartSuccess(true));
        return response.data;
      } else {
        dispatch(setCartError('Cart save failed'));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving cart';
      dispatch(setCartError(errorMessage));
      return null;
    } finally {
      dispatch(setCartLoading(false));
    }
  }
);

export default cartSlice.reducer;
