import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderMenuAllergy from "../interfaces/IOrderMenuAllergy";

export interface OrderMenuAllergyState {
  list: IOrderMenuAllergy[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderMenuAllergyState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderMenuAllergySlice = createSlice({
  name: 'orderMenuAllergy',
  initialState,
  reducers: {
    setOrderMenuAllergyList: (state, action: PayloadAction<IOrderMenuAllergy[]>) => {
      state.list = action.payload;
    },
    setOrderMenuAllergyListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderMenuAllergyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderMenuAllergyError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderMenuAllergySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderMenuAllergyState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderMenuAllergyList,
  setOrderMenuAllergyListTotalCount,
  setOrderMenuAllergyLoading,
  setOrderMenuAllergyError,
  setOrderMenuAllergySuccess,
  resetOrderMenuAllergyState
} = orderMenuAllergySlice.actions;

// Action thunk pour récupérer la liste des allergies de menu de commande
export const getOrderMenuAllergyList = createAsyncThunk(
  'orderMenuAllergy/getOrderMenuAllergyList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderMenuAllergyLoading(true));
      dispatch(setOrderMenuAllergyError(null));

      const response = await axios.get(`/api/order_menu_allergy/list/`);
      if (response.data.data) {
        dispatch(setOrderMenuAllergyList(response.data.data));
        dispatch(setOrderMenuAllergyListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuAllergyError("Get order menu allergy list failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuAllergyLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des allergies de menu de commande avec pagination
export const getOrderMenuAllergyListWithPagination = createAsyncThunk(
  'orderMenuAllergy/getOrderMenuAllergyListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderMenuAllergyLoading(true));
      dispatch(setOrderMenuAllergyError(null));

      const response = await axios.get(`/api/order_menu_allergy/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderMenuAllergyList(response.data.data));
        dispatch(setOrderMenuAllergyListTotalCount(response.data.total));
      } else {
        dispatch(setOrderMenuAllergyError("Get order menu allergy list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuAllergyLoading(false));
    }
  }
);

// Action thunk pour ajouter une allergie de menu de commande
export const addOrderMenuAllergy = createAsyncThunk(
  'orderMenuAllergy/addOrderMenuAllergy',
  async (orderMenuAllergyData: Partial<IOrderMenuAllergy>, { dispatch }) => {
    try {
      dispatch(setOrderMenuAllergyLoading(true));
      dispatch(setOrderMenuAllergySuccess(false));
      dispatch(setOrderMenuAllergyError(null));

      const response = await axios.post(`/api/order_menu_allergy/add/`, orderMenuAllergyData);
      if (response.data) {
        dispatch(setOrderMenuAllergySuccess(true));
        dispatch(getOrderMenuAllergyList());
      } else {
        dispatch(setOrderMenuAllergyError("Add order menu allergy failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuAllergyLoading(false));
    }
  }
);

// Action thunk pour supprimer une allergie de menu de commande
export const deleteOrderMenuAllergy = createAsyncThunk(
  'orderMenuAllergy/deleteOrderMenuAllergy',
  async (orderMenuAllergyId: number, { dispatch }) => {
    try {
      dispatch(setOrderMenuAllergyLoading(true));
      dispatch(setOrderMenuAllergySuccess(false));
      dispatch(setOrderMenuAllergyError(null));

      const response = await axios.delete(`/api/order_menu_allergy/delete/${orderMenuAllergyId}`);
      if (response.data) {
        dispatch(setOrderMenuAllergySuccess(true));
        dispatch(getOrderMenuAllergyList());
      } else {
        dispatch(setOrderMenuAllergyError("Delete order menu allergy failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuAllergyLoading(false));
    }
  }
);

// Action thunk pour modifier une allergie de menu de commande
export const editOrderMenuAllergy = createAsyncThunk(
  'orderMenuAllergy/editOrderMenuAllergy',
  async ({ orderMenuAllergyId, orderMenuAllergyData }: { orderMenuAllergyId: number; orderMenuAllergyData: Partial<IOrderMenuAllergy> }, { dispatch }) => {
    try {
      dispatch(setOrderMenuAllergyLoading(true));
      dispatch(setOrderMenuAllergySuccess(false));
      dispatch(setOrderMenuAllergyError(null));

      const response = await axios.put(`/api/order_menu_allergy/edit/${orderMenuAllergyId}`, orderMenuAllergyData);
      if (response.data) {
        dispatch(setOrderMenuAllergySuccess(true));
        dispatch(getOrderMenuAllergyList());
      } else {
        dispatch(setOrderMenuAllergyError("Edit order menu allergy failed!"));
      }
    } catch (error) {
      dispatch(setOrderMenuAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderMenuAllergyLoading(false));
    }
  }
);

export default orderMenuAllergySlice.reducer; 