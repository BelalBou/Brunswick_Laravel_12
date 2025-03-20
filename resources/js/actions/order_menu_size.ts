import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderMenuSize from "../interfaces/IOrderMenuSize";

export interface OrderMenuSizeState {
  list: IOrderMenuSize[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderMenuSizeState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderMenuSizeSlice = createSlice({
  name: 'orderMenuSize',
  initialState,
  reducers: {
    setOrderMenuSizeList: (state, action: PayloadAction<IOrderMenuSize[]>) => {
      state.list = action.payload;
    },
    setOrderMenuSizeListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderMenuSizeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderMenuSizeError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderMenuSizeSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderMenuSizeState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderMenuSizeList,
  setOrderMenuSizeListTotalCount,
  setOrderMenuSizeLoading,
  setOrderMenuSizeError,
  setOrderMenuSizeSuccess,
  resetOrderMenuSizeState
} = orderMenuSizeSlice.actions;

// Action thunk pour récupérer la liste des tailles de menu de commande
export const getOrderMenuSizeList = createAsyncThunk(
  'orderMenuSize/getOrderMenuSizeList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderMenuSizeLoading(true));
      dispatch(setOrderMenuSizeError(null));

      const response = await axios.get(`/api/order_menu_size/list/`);
      if (response.data.data) {
        dispatch(setOrderMenuSizeList(response.data.data));
        dispatch(setOrderMenuSizeListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuSizeError("Get order menu size list failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuSizeLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des tailles de menu de commande avec pagination
export const getOrderMenuSizeListWithPagination = createAsyncThunk(
  'orderMenuSize/getOrderMenuSizeListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderMenuSizeLoading(true));
      dispatch(setOrderMenuSizeError(null));

      const response = await axios.get(`/api/order_menu_size/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderMenuSizeList(response.data.data));
        dispatch(setOrderMenuSizeListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuSizeError("Get order menu size list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuSizeLoading(false));
    }
  }
);

// Action thunk pour ajouter une taille de menu de commande
export const addOrderMenuSize = createAsyncThunk(
  'orderMenuSize/addOrderMenuSize',
  async (orderMenuSizeData: Partial<IOrderMenuSize>, { dispatch }) => {
    try {
      dispatch(setOrderMenuSizeLoading(true));
      dispatch(setOrderMenuSizeSuccess(false));
      dispatch(setOrderMenuSizeError(null));

      const response = await axios.post(`/api/order_menu_size/add/`, orderMenuSizeData);
      if (response.data) {
        dispatch(setOrderMenuSizeSuccess(true));
        dispatch(getOrderMenuSizeList());
      } else {
        dispatch(setOrderMenuSizeError("Add order menu size failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuSizeLoading(false));
    }
  }
);

// Action thunk pour supprimer une taille de menu de commande
export const deleteOrderMenuSize = createAsyncThunk(
  'orderMenuSize/deleteOrderMenuSize',
  async (orderMenuSizeId: number, { dispatch }) => {
    try {
      dispatch(setOrderMenuSizeLoading(true));
      dispatch(setOrderMenuSizeSuccess(false));
      dispatch(setOrderMenuSizeError(null));

      const response = await axios.delete(`/api/order_menu_size/delete/${orderMenuSizeId}`);
      if (response.data) {
        dispatch(setOrderMenuSizeSuccess(true));
        dispatch(getOrderMenuSizeList());
      } else {
        dispatch(setOrderMenuSizeError("Delete order menu size failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuSizeLoading(false));
    }
  }
);

// Action thunk pour modifier une taille de menu de commande
export const editOrderMenuSize = createAsyncThunk(
  'orderMenuSize/editOrderMenuSize',
  async ({ orderMenuSizeId, orderMenuSizeData }: { orderMenuSizeId: number; orderMenuSizeData: Partial<IOrderMenuSize> }, { dispatch }) => {
    try {
      dispatch(setOrderMenuSizeLoading(true));
      dispatch(setOrderMenuSizeSuccess(false));
      dispatch(setOrderMenuSizeError(null));

      const response = await axios.put(`/api/order_menu_size/edit/${orderMenuSizeId}`, orderMenuSizeData);
      if (response.data) {
        dispatch(setOrderMenuSizeSuccess(true));
        dispatch(getOrderMenuSizeList());
      } else {
        dispatch(setOrderMenuSizeError("Edit order menu size failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuSizeLoading(false));
    }
  }
);

export default orderMenuSizeSlice.reducer; 