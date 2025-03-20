import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderMenuExtra from "../interfaces/IOrderMenuExtra";

export interface OrderMenuExtraState {
  list: IOrderMenuExtra[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderMenuExtraState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderMenuExtraSlice = createSlice({
  name: 'orderMenuExtra',
  initialState,
  reducers: {
    setOrderMenuExtraList: (state, action: PayloadAction<IOrderMenuExtra[]>) => {
      state.list = action.payload;
    },
    setOrderMenuExtraListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderMenuExtraLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderMenuExtraError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderMenuExtraSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderMenuExtraState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderMenuExtraList,
  setOrderMenuExtraListTotalCount,
  setOrderMenuExtraLoading,
  setOrderMenuExtraError,
  setOrderMenuExtraSuccess,
  resetOrderMenuExtraState
} = orderMenuExtraSlice.actions;

// Action thunk pour récupérer la liste des extras de menu de commande
export const getOrderMenuExtraList = createAsyncThunk(
  'orderMenuExtra/getOrderMenuExtraList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderMenuExtraLoading(true));
      dispatch(setOrderMenuExtraError(null));

      const response = await axios.get(`/api/order_menu_extra/list/`);
      if (response.data.data) {
        dispatch(setOrderMenuExtraList(response.data.data));
        dispatch(setOrderMenuExtraListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuExtraError("Get order menu extra list failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuExtraLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des extras de menu de commande avec pagination
export const getOrderMenuExtraListWithPagination = createAsyncThunk(
  'orderMenuExtra/getOrderMenuExtraListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderMenuExtraLoading(true));
      dispatch(setOrderMenuExtraError(null));

      const response = await axios.get(`/api/order_menu_extra/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderMenuExtraList(response.data.data));
        dispatch(setOrderMenuExtraListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuExtraError("Get order menu extra list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuExtraLoading(false));
    }
  }
);

// Action thunk pour ajouter un extra de menu de commande
export const addOrderMenuExtra = createAsyncThunk(
  'orderMenuExtra/addOrderMenuExtra',
  async (orderMenuExtraData: Partial<IOrderMenuExtra>, { dispatch }) => {
    try {
      dispatch(setOrderMenuExtraLoading(true));
      dispatch(setOrderMenuExtraSuccess(false));
      dispatch(setOrderMenuExtraError(null));

      const response = await axios.post(`/api/order_menu_extra/add/`, orderMenuExtraData);
      if (response.data) {
        dispatch(setOrderMenuExtraSuccess(true));
        dispatch(getOrderMenuExtraList());
      } else {
        dispatch(setOrderMenuExtraError("Add order menu extra failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuExtraLoading(false));
    }
  }
);

// Action thunk pour supprimer un extra de menu de commande
export const deleteOrderMenuExtra = createAsyncThunk(
  'orderMenuExtra/deleteOrderMenuExtra',
  async (orderMenuExtraId: number, { dispatch }) => {
    try {
      dispatch(setOrderMenuExtraLoading(true));
      dispatch(setOrderMenuExtraSuccess(false));
      dispatch(setOrderMenuExtraError(null));

      const response = await axios.delete(`/api/order_menu_extra/delete/${orderMenuExtraId}`);
      if (response.data) {
        dispatch(setOrderMenuExtraSuccess(true));
        dispatch(getOrderMenuExtraList());
      } else {
        dispatch(setOrderMenuExtraError("Delete order menu extra failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuExtraLoading(false));
    }
  }
);

// Action thunk pour modifier un extra de menu de commande
export const editOrderMenuExtra = createAsyncThunk(
  'orderMenuExtra/editOrderMenuExtra',
  async ({ orderMenuExtraId, orderMenuExtraData }: { orderMenuExtraId: number; orderMenuExtraData: Partial<IOrderMenuExtra> }, { dispatch }) => {
    try {
      dispatch(setOrderMenuExtraLoading(true));
      dispatch(setOrderMenuExtraSuccess(false));
      dispatch(setOrderMenuExtraError(null));

      const response = await axios.put(`/api/order_menu_extra/edit/${orderMenuExtraId}`, orderMenuExtraData);
      if (response.data) {
        dispatch(setOrderMenuExtraSuccess(true));
        dispatch(getOrderMenuExtraList());
      } else {
        dispatch(setOrderMenuExtraError("Edit order menu extra failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuExtraLoading(false));
    }
  }
);

export default orderMenuExtraSlice.reducer; 