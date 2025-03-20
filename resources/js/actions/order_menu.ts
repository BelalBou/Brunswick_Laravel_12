import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderMenu from "../interfaces/IOrderMenu";

export interface OrderMenuState {
  list: IOrderMenu[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderMenuState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderMenuSlice = createSlice({
  name: 'orderMenu',
  initialState,
  reducers: {
    setOrderMenuList: (state, action: PayloadAction<IOrderMenu[]>) => {
      state.list = action.payload;
    },
    setOrderMenuListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderMenuLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderMenuError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderMenuSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderMenuState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderMenuList,
  setOrderMenuListTotalCount,
  setOrderMenuLoading,
  setOrderMenuError,
  setOrderMenuSuccess,
  resetOrderMenuState
} = orderMenuSlice.actions;

// Action thunk pour récupérer la liste des menus de commande
export const getOrderMenuList = createAsyncThunk(
  'orderMenu/getOrderMenuList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderMenuLoading(true));
      dispatch(setOrderMenuError(null));

      const response = await axios.get(`/api/order_menu/list/`);
      if (response.data.data) {
        dispatch(setOrderMenuList(response.data.data));
        dispatch(setOrderMenuListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuError("Get order menu list failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des menus de commande avec pagination
export const getOrderMenuListWithPagination = createAsyncThunk(
  'orderMenu/getOrderMenuListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderMenuLoading(true));
      dispatch(setOrderMenuError(null));

      const response = await axios.get(`/api/order_menu/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderMenuList(response.data.data));
        dispatch(setOrderMenuListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuError("Get order menu list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuLoading(false));
    }
  }
);

// Action thunk pour ajouter un menu de commande
export const addOrderMenu = createAsyncThunk(
  'orderMenu/addOrderMenu',
  async (orderMenuData: Partial<IOrderMenu>, { dispatch }) => {
    try {
      dispatch(setOrderMenuLoading(true));
      dispatch(setOrderMenuSuccess(false));
      dispatch(setOrderMenuError(null));

      const response = await axios.post(`/api/order_menu/add/`, orderMenuData);
      if (response.data) {
        dispatch(setOrderMenuSuccess(true));
        dispatch(getOrderMenuList());
      } else {
        dispatch(setOrderMenuError("Add order menu failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuLoading(false));
    }
  }
);

// Action thunk pour supprimer un menu de commande
export const deleteOrderMenu = createAsyncThunk(
  'orderMenu/deleteOrderMenu',
  async (orderMenuId: number, { dispatch }) => {
    try {
      dispatch(setOrderMenuLoading(true));
      dispatch(setOrderMenuSuccess(false));
      dispatch(setOrderMenuError(null));

      const response = await axios.delete(`/api/order_menu/delete/${orderMenuId}`);
      if (response.data) {
        dispatch(setOrderMenuSuccess(true));
        dispatch(getOrderMenuList());
      } else {
        dispatch(setOrderMenuError("Delete order menu failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuLoading(false));
    }
  }
);

// Action thunk pour modifier un menu de commande
export const editOrderMenu = createAsyncThunk(
  'orderMenu/editOrderMenu',
  async ({ orderMenuId, orderMenuData }: { orderMenuId: number; orderMenuData: Partial<IOrderMenu> }, { dispatch }) => {
    try {
      dispatch(setOrderMenuLoading(true));
      dispatch(setOrderMenuSuccess(false));
      dispatch(setOrderMenuError(null));

      const response = await axios.put(`/api/order_menu/edit/${orderMenuId}`, orderMenuData);
      if (response.data) {
        dispatch(setOrderMenuSuccess(true));
        dispatch(getOrderMenuList());
      } else {
        dispatch(setOrderMenuError("Edit order menu failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuLoading(false));
    }
  }
);

export default orderMenuSlice.reducer; 