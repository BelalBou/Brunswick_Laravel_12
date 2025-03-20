import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IOrderAllergy from "../interfaces/IOrderAllergy";

export interface OrderAllergyState {
  list: IOrderAllergy[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderAllergyState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderAllergySlice = createSlice({
  name: 'orderAllergy',
  initialState,
  reducers: {
    setOrderAllergyList: (state, action: PayloadAction<IOrderAllergy[]>) => {
      state.list = action.payload;
    },
    setOrderAllergyListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderAllergyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderAllergyError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderAllergySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderAllergyState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderAllergyList,
  setOrderAllergyListTotalCount,
  setOrderAllergyLoading,
  setOrderAllergyError,
  setOrderAllergySuccess,
  resetOrderAllergyState
} = orderAllergySlice.actions;

// Action thunk pour récupérer la liste des allergies de commande
export const getOrderAllergyList = createAsyncThunk(
  'orderAllergy/getOrderAllergyList',
  async (_, { dispatch }) => {
    try {
      dispatch(setOrderAllergyLoading(true));
      dispatch(setOrderAllergyError(null));

      const response = await axios.get(`/api/order_allergy/list/`);
      if (response.data.data) {
        dispatch(setOrderAllergyList(response.data.data));
        dispatch(setOrderAllergyListTotalCount(response.data.total));
      } else {
        dispatch(setOrderAllergyError("Get order allergy list failed!"));
      }
    } catch (error) {
      dispatch(setOrderAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderAllergyLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des allergies de commande avec pagination
export const getOrderAllergyListWithPagination = createAsyncThunk(
  'orderAllergy/getOrderAllergyListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setOrderAllergyLoading(true));
      dispatch(setOrderAllergyError(null));

      const response = await axios.get(`/api/order_allergy/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setOrderAllergyList(response.data.data));
        dispatch(setOrderAllergyListTotalCount(response.data.total));
      } else {
        dispatch(setOrderAllergyError("Get order allergy list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setOrderAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderAllergyLoading(false));
    }
  }
);

// Action thunk pour ajouter une allergie de commande
export const addOrderAllergy = createAsyncThunk(
  'orderAllergy/addOrderAllergy',
  async (orderAllergyData: Partial<IOrderAllergy>, { dispatch }) => {
    try {
      dispatch(setOrderAllergyLoading(true));
      dispatch(setOrderAllergySuccess(false));
      dispatch(setOrderAllergyError(null));

      const response = await axios.post(`/api/order_allergy/add/`, orderAllergyData);
      if (response.data) {
        dispatch(setOrderAllergySuccess(true));
        dispatch(getOrderAllergyList());
      } else {
        dispatch(setOrderAllergyError("Add order allergy failed!"));
      }
    } catch (error) {
      dispatch(setOrderAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderAllergyLoading(false));
    }
  }
);

// Action thunk pour supprimer une allergie de commande
export const deleteOrderAllergy = createAsyncThunk(
  'orderAllergy/deleteOrderAllergy',
  async (orderAllergyId: number, { dispatch }) => {
    try {
      dispatch(setOrderAllergyLoading(true));
      dispatch(setOrderAllergySuccess(false));
      dispatch(setOrderAllergyError(null));

      const response = await axios.delete(`/api/order_allergy/delete/${orderAllergyId}`);
      if (response.data) {
        dispatch(setOrderAllergySuccess(true));
        dispatch(getOrderAllergyList());
      } else {
        dispatch(setOrderAllergyError("Delete order allergy failed!"));
      }
    } catch (error) {
      dispatch(setOrderAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderAllergyLoading(false));
    }
  }
);

// Action thunk pour modifier une allergie de commande
export const editOrderAllergy = createAsyncThunk(
  'orderAllergy/editOrderAllergy',
  async ({ orderAllergyId, orderAllergyData }: { orderAllergyId: number; orderAllergyData: Partial<IOrderAllergy> }, { dispatch }) => {
    try {
      dispatch(setOrderAllergyLoading(true));
      dispatch(setOrderAllergySuccess(false));
      dispatch(setOrderAllergyError(null));

      const response = await axios.put(`/api/order_allergy/edit/${orderAllergyId}`, orderAllergyData);
      if (response.data) {
        dispatch(setOrderAllergySuccess(true));
        dispatch(getOrderAllergyList());
      } else {
        dispatch(setOrderAllergyError("Edit order allergy failed!"));
      }
    } catch (error) {
      dispatch(setOrderAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setOrderAllergyLoading(false));
    }
  }
);

export default orderAllergySlice.reducer; 