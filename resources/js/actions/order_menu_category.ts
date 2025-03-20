import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderMenuCategory from "../interfaces/IOrderMenuCategory";

export interface OrderMenuCategoryState {
  list: IOrderMenuCategory[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderMenuCategoryState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderMenuCategorySlice = createSlice({
  name: 'orderMenuCategory',
  initialState,
  reducers: {
    setOrderMenuCategoryList: (state, action: PayloadAction<IOrderMenuCategory[]>) => {
      state.list = action.payload;
    },
    setOrderMenuCategoryListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderMenuCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderMenuCategoryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderMenuCategorySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderMenuCategoryState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderMenuCategoryList,
  setOrderMenuCategoryListTotalCount,
  setOrderMenuCategoryLoading,
  setOrderMenuCategoryError,
  setOrderMenuCategorySuccess,
  resetOrderMenuCategoryState
} = orderMenuCategorySlice.actions;

// Action thunk pour récupérer la liste des catégories de menu de commande
export const getOrderMenuCategoryList = createAsyncThunk(
  'orderMenuCategory/getOrderMenuCategoryList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderMenuCategoryLoading(true));
      dispatch(setOrderMenuCategoryError(null));

      const response = await axios.get(`/api/order_menu_category/list/`);
      if (response.data.data) {
        dispatch(setOrderMenuCategoryList(response.data.data));
        dispatch(setOrderMenuCategoryListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuCategoryError("Get order menu category list failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuCategoryLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des catégories de menu de commande avec pagination
export const getOrderMenuCategoryListWithPagination = createAsyncThunk(
  'orderMenuCategory/getOrderMenuCategoryListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderMenuCategoryLoading(true));
      dispatch(setOrderMenuCategoryError(null));

      const response = await axios.get(`/api/order_menu_category/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderMenuCategoryList(response.data.data));
        dispatch(setOrderMenuCategoryListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuCategoryError("Get order menu category list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuCategoryLoading(false));
    }
  }
);

// Action thunk pour ajouter une catégorie de menu de commande
export const addOrderMenuCategory = createAsyncThunk(
  'orderMenuCategory/addOrderMenuCategory',
  async (orderMenuCategoryData: Partial<IOrderMenuCategory>, { dispatch }) => {
    try {
      dispatch(setOrderMenuCategoryLoading(true));
      dispatch(setOrderMenuCategorySuccess(false));
      dispatch(setOrderMenuCategoryError(null));

      const response = await axios.post(`/api/order_menu_category/add/`, orderMenuCategoryData);
      if (response.data) {
        dispatch(setOrderMenuCategorySuccess(true));
        dispatch(getOrderMenuCategoryList());
      } else {
        dispatch(setOrderMenuCategoryError("Add order menu category failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuCategoryLoading(false));
    }
  }
);

// Action thunk pour supprimer une catégorie de menu de commande
export const deleteOrderMenuCategory = createAsyncThunk(
  'orderMenuCategory/deleteOrderMenuCategory',
  async (orderMenuCategoryId: number, { dispatch }) => {
    try {
      dispatch(setOrderMenuCategoryLoading(true));
      dispatch(setOrderMenuCategorySuccess(false));
      dispatch(setOrderMenuCategoryError(null));

      const response = await axios.delete(`/api/order_menu_category/delete/${orderMenuCategoryId}`);
      if (response.data) {
        dispatch(setOrderMenuCategorySuccess(true));
        dispatch(getOrderMenuCategoryList());
      } else {
        dispatch(setOrderMenuCategoryError("Delete order menu category failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuCategoryLoading(false));
    }
  }
);

// Action thunk pour modifier une catégorie de menu de commande
export const editOrderMenuCategory = createAsyncThunk(
  'orderMenuCategory/editOrderMenuCategory',
  async ({ orderMenuCategoryId, orderMenuCategoryData }: { orderMenuCategoryId: number; orderMenuCategoryData: Partial<IOrderMenuCategory> }, { dispatch }) => {
    try {
      dispatch(setOrderMenuCategoryLoading(true));
      dispatch(setOrderMenuCategorySuccess(false));
      dispatch(setOrderMenuCategoryError(null));

      const response = await axios.put(`/api/order_menu_category/edit/${orderMenuCategoryId}`, orderMenuCategoryData);
      if (response.data) {
        dispatch(setOrderMenuCategorySuccess(true));
        dispatch(getOrderMenuCategoryList());
      } else {
        dispatch(setOrderMenuCategoryError("Edit order menu category failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuCategoryLoading(false));
    }
  }
);

export default orderMenuCategorySlice.reducer; 