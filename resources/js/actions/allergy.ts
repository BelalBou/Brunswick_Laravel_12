import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import IAllergy from "../interfaces/IAllergy";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface AllergyState {
  list: IAllergy[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AllergyState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const allergySlice = createSlice({
  name: 'allergy',
  initialState,
  reducers: {
    setAllergyList: (state, action: PayloadAction<IAllergy[]>) => {
      state.list = action.payload;
    },
    setAllergyListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setAllergyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAllergyError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAllergySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetAllergyState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setAllergyList,
  setAllergyListTotalCount,
  setAllergyLoading,
  setAllergyError,
  setAllergySuccess,
  resetAllergyState
} = allergySlice.actions;

// Action thunk pour récupérer la liste des allergies
export const getAllergyList = createAsyncThunk(
  'allergy/getAllergyList',
  async (_, { dispatch }) => {
    try {
      dispatch(setAllergyLoading(true));
      dispatch(setAllergyError(null));

      const response = await axios.get(`/api/allergies/list/`);
      if (response.data.data) {
        dispatch(setAllergyList(response.data.data));
        dispatch(setAllergyListTotalCount(response.data.total));
      } else {
        dispatch(setAllergyError("Get allergy list failed!"));
      }
    } catch (error) {
      dispatch(setAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setAllergyLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des allergies avec pagination
export const getAllergyListWithPagination = createAsyncThunk(
  'allergy/getAllergyListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setAllergyLoading(true));
      dispatch(setAllergyError(null));

      const response = await axios.get(`/api/allergies/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setAllergyList(response.data.data));
        dispatch(setAllergyListTotalCount(response.data.total));
      } else {
        dispatch(setAllergyError("Get allergy list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setAllergyLoading(false));
    }
  }
);

// Action thunk pour ajouter une allergie
export const addAllergy = createAsyncThunk(
  'allergy/addAllergy',
  async (allergyData: Partial<IAllergy>, { dispatch }) => {
    try {
      dispatch(setAllergyLoading(true));
      dispatch(setAllergySuccess(false));
      dispatch(setAllergyError(null));

      const response = await axios.post(`/api/allergies/add/`, allergyData);
      if (response.data) {
        dispatch(setAllergySuccess(true));
        dispatch(getAllergyList());
      } else {
        dispatch(setAllergyError("Add allergy failed!"));
      }
    } catch (error) {
      dispatch(setAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setAllergyLoading(false));
    }
  }
);

// Action thunk pour supprimer une allergie
export const deleteAllergy = createAsyncThunk(
  'allergy/deleteAllergy',
  async (allergyId: number, { dispatch }) => {
    try {
      dispatch(setAllergyLoading(true));
      dispatch(setAllergySuccess(false));
      dispatch(setAllergyError(null));

      const response = await axios.delete(`/api/allergies/delete/${allergyId}`);
      if (response.data) {
        dispatch(setAllergySuccess(true));
        dispatch(getAllergyList());
      } else {
        dispatch(setAllergyError("Delete allergy failed!"));
      }
    } catch (error) {
      dispatch(setAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setAllergyLoading(false));
    }
  }
);

// Action thunk pour modifier une allergie
export const editAllergy = createAsyncThunk(
  'allergy/editAllergy',
  async ({ allergyId, allergyData }: { allergyId: number; allergyData: Partial<IAllergy> }, { dispatch }) => {
    try {
      dispatch(setAllergyLoading(true));
      dispatch(setAllergySuccess(false));
      dispatch(setAllergyError(null));

      const response = await axios.put(`/api/allergies/edit/${allergyId}`, allergyData);
      if (response.data) {
        dispatch(setAllergySuccess(true));
        dispatch(getAllergyList());
      } else {
        dispatch(setAllergyError("Edit allergy failed!"));
      }
    } catch (error) {
      dispatch(setAllergyError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setAllergyLoading(false));
    }
  }
);

export default allergySlice.reducer;
