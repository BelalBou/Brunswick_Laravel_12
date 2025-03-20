import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderExtra from "../interfaces/IOrderExtra";

export interface OrderExtraState {
  list: IOrderExtra[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderExtraState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderExtraSlice = createSlice({
  name: 'orderExtra',
  initialState,
  reducers: {
    setOrderExtraList: (state, action: PayloadAction<IOrderExtra[]>) => {
      state.list = action.payload;
    },
    setOrderExtraListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderExtraLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderExtraError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderExtraSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderExtraState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderExtraList,
  setOrderExtraListTotalCount,
  setOrderExtraLoading,
  setOrderExtraError,
  setOrderExtraSuccess,
  resetOrderExtraState
} = orderExtraSlice.actions;

// Action thunk pour récupérer la liste des extras de commande
export const getOrderExtraList = createAsyncThunk(
  'orderExtra/getOrderExtraList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderExtraLoading(true));
      dispatch(setOrderExtraError(null));

      const response = await axios.get(`/api/order_extra/list/`);
      if (response.data.data) {
        dispatch(setOrderExtraList(response.data.data));
        dispatch(setOrderExtraListTotalCount(response.data.total));
      } else {
        dispatch(setOrderExtraError("Get order extra list failed!"));
      }
    } catch (error) {
      dispatch(setOrderExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderExtraLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des extras de commande avec pagination
export const getOrderExtraListWithPagination = createAsyncThunk(
  'orderExtra/getOrderExtraListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderExtraLoading(true));
      dispatch(setOrderExtraError(null));

      const response = await axios.get(`/api/order_extra/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderExtraList(response.data.data));
        dispatch(setOrderExtraListTotalCount(response.data.total));
      } else {
        dispatch(setOrderExtraError("Get order extra list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderExtraLoading(false));
    }
  }
);

// Action thunk pour ajouter un extra de commande
export const addOrderExtra = createAsyncThunk(
  'orderExtra/addOrderExtra',
  async (orderExtraData: Partial<IOrderExtra>, { dispatch }) => {
    try {
      dispatch(setOrderExtraLoading(true));
      dispatch(setOrderExtraSuccess(false));
      dispatch(setOrderExtraError(null));

      const response = await axios.post(`/api/order_extra/add/`, orderExtraData);
      if (response.data) {
        dispatch(setOrderExtraSuccess(true));
        dispatch(getOrderExtraList());
      } else {
        dispatch(setOrderExtraError("Add order extra failed!"));
      }
    } catch (error) {
      dispatch(setOrderExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderExtraLoading(false));
    }
  }
);

// Action thunk pour supprimer un extra de commande
export const deleteOrderExtra = createAsyncThunk(
  'orderExtra/deleteOrderExtra',
  async (orderExtraId: number, { dispatch }) => {
    try {
      dispatch(setOrderExtraLoading(true));
      dispatch(setOrderExtraSuccess(false));
      dispatch(setOrderExtraError(null));

      const response = await axios.delete(`/api/order_extra/delete/${orderExtraId}`);
      if (response.data) {
        dispatch(setOrderExtraSuccess(true));
        dispatch(getOrderExtraList());
      } else {
        dispatch(setOrderExtraError("Delete order extra failed!"));
      }
    } catch (error) {
      dispatch(setOrderExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderExtraLoading(false));
    }
  }
);

// Action thunk pour modifier un extra de commande
export const editOrderExtra = createAsyncThunk(
  'orderExtra/editOrderExtra',
  async ({ orderExtraId, orderExtraData }: { orderExtraId: number; orderExtraData: Partial<IOrderExtra> }, { dispatch }) => {
    try {
      dispatch(setOrderExtraLoading(true));
      dispatch(setOrderExtraSuccess(false));
      dispatch(setOrderExtraError(null));

      const response = await axios.put(`/api/order_extra/edit/${orderExtraId}`, orderExtraData);
      if (response.data) {
        dispatch(setOrderExtraSuccess(true));
        dispatch(getOrderExtraList());
      } else {
        dispatch(setOrderExtraError("Edit order extra failed!"));
      }
    } catch (error) {
      dispatch(setOrderExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderExtraLoading(false));
    }
  }
);

export default orderExtraSlice.reducer; 