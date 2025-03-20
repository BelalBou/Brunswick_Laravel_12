import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderDisplay from "../interfaces/IOrderDisplay";

export interface OrderDisplayState {
  list: IOrderDisplay[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderDisplayState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderDisplaySlice = createSlice({
  name: 'orderDisplay',
  initialState,
  reducers: {
    setOrderDisplayList: (state, action: PayloadAction<IOrderDisplay[]>) => {
      state.list = action.payload;
    },
    setOrderDisplayListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderDisplayLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderDisplayError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderDisplaySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderDisplayState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderDisplayList,
  setOrderDisplayListTotalCount,
  setOrderDisplayLoading,
  setOrderDisplayError,
  setOrderDisplaySuccess,
  resetOrderDisplayState
} = orderDisplaySlice.actions;

// Action thunk pour récupérer la liste des commandes à afficher
export const getOrderDisplayList = createAsyncThunk(
  'orderDisplay/getOrderDisplayList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderDisplayLoading(true));
      dispatch(setOrderDisplayError(null));

      const response = await axios.get(`/api/order_display/list/`);
      if (response.data.data) {
        dispatch(setOrderDisplayList(response.data.data));
        dispatch(setOrderDisplayListTotalCount(response.data.total));
      } else {
        dispatch(setOrderDisplayError("Get order display list failed!"));
      }
    } catch (error) {
      dispatch(setOrderDisplayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderDisplayLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des commandes à afficher avec pagination
export const getOrderDisplayListWithPagination = createAsyncThunk(
  'orderDisplay/getOrderDisplayListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderDisplayLoading(true));
      dispatch(setOrderDisplayError(null));

      const response = await axios.get(`/api/order_display/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderDisplayList(response.data.data));
        dispatch(setOrderDisplayListTotalCount(response.data.total));
      } else {
        dispatch(setOrderDisplayError("Get order display list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderDisplayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderDisplayLoading(false));
    }
  }
);

// Action thunk pour ajouter une commande à afficher
export const addOrderDisplay = createAsyncThunk(
  'orderDisplay/addOrderDisplay',
  async (orderDisplayData: Partial<IOrderDisplay>, { dispatch }) => {
    try {
      dispatch(setOrderDisplayLoading(true));
      dispatch(setOrderDisplaySuccess(false));
      dispatch(setOrderDisplayError(null));

      const response = await axios.post(`/api/order_display/add/`, orderDisplayData);
      if (response.data) {
        dispatch(setOrderDisplaySuccess(true));
        dispatch(getOrderDisplayList());
      } else {
        dispatch(setOrderDisplayError("Add order display failed!"));
      }
    } catch (error) {
      dispatch(setOrderDisplayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderDisplayLoading(false));
    }
  }
);

// Action thunk pour supprimer une commande à afficher
export const deleteOrderDisplay = createAsyncThunk(
  'orderDisplay/deleteOrderDisplay',
  async (orderDisplayId: number, { dispatch }) => {
    try {
      dispatch(setOrderDisplayLoading(true));
      dispatch(setOrderDisplaySuccess(false));
      dispatch(setOrderDisplayError(null));

      const response = await axios.delete(`/api/order_display/delete/${orderDisplayId}`);
      if (response.data) {
        dispatch(setOrderDisplaySuccess(true));
        dispatch(getOrderDisplayList());
      } else {
        dispatch(setOrderDisplayError("Delete order display failed!"));
      }
    } catch (error) {
      dispatch(setOrderDisplayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderDisplayLoading(false));
    }
  }
);

// Action thunk pour modifier une commande à afficher
export const editOrderDisplay = createAsyncThunk(
  'orderDisplay/editOrderDisplay',
  async ({ orderDisplayId, orderDisplayData }: { orderDisplayId: number; orderDisplayData: Partial<IOrderDisplay> }, { dispatch }) => {
    try {
      dispatch(setOrderDisplayLoading(true));
      dispatch(setOrderDisplaySuccess(false));
      dispatch(setOrderDisplayError(null));

      const response = await axios.put(`/api/order_display/edit/${orderDisplayId}`, orderDisplayData);
      if (response.data) {
        dispatch(setOrderDisplaySuccess(true));
        dispatch(getOrderDisplayList());
      } else {
        dispatch(setOrderDisplayError("Edit order display failed!"));
      }
    } catch (error) {
      dispatch(setOrderDisplayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderDisplayLoading(false));
    }
  }
);

export default orderDisplaySlice.reducer; 