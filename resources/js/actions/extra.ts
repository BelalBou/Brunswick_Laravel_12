import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IExtra from "../interfaces/IExtra";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface ExtraState {
  list: IExtra[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ExtraState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const extraSlice = createSlice({
  name: 'extra',
  initialState,
  reducers: {
    setExtraList: (state, action: PayloadAction<IExtra[]>) => {
      state.list = action.payload;
    },
    setExtraListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setExtraLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setExtraError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setExtraSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetExtraState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setExtraList,
  setExtraListTotalCount,
  setExtraLoading,
  setExtraError,
  setExtraSuccess,
  resetExtraState
} = extraSlice.actions;

// Action thunk pour récupérer la liste des extras
export const getExtraList = createAsyncThunk(
  'extra/getExtraList',
  async (_, { dispatch }) => {
    try {
      dispatch(setExtraLoading(true));
      dispatch(setExtraError(null));

      const response = await axios.get(`/api/extras/list/`);
      if (response.data.data) {
        dispatch(setExtraList(response.data.data));
        dispatch(setExtraListTotalCount(response.data.total));
      } else {
        dispatch(setExtraError("Get extra list failed!"));
      }
    } catch (error) {
      dispatch(setExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setExtraLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des extras avec pagination
export const getExtraListWithPagination = createAsyncThunk(
  'extra/getExtraListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setExtraLoading(true));
      dispatch(setExtraError(null));

      const response = await axios.get(`/api/extras/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setExtraList(response.data.data));
        dispatch(setExtraListTotalCount(response.data.total));
      } else {
        dispatch(setExtraError("Get extra list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setExtraLoading(false));
    }
  }
);

// Action thunk pour ajouter un extra
export const addExtra = createAsyncThunk(
  'extra/addExtra',
  async (extraData: Partial<IExtra>, { dispatch }) => {
    try {
      dispatch(setExtraLoading(true));
      dispatch(setExtraSuccess(false));
      dispatch(setExtraError(null));

      const response = await axios.post(`/api/extras/add/`, extraData);
      if (response.data) {
        dispatch(setExtraSuccess(true));
        dispatch(getExtraList());
      } else {
        dispatch(setExtraError("Add extra failed!"));
      }
    } catch (error) {
      dispatch(setExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setExtraLoading(false));
    }
  }
);

// Action thunk pour supprimer un extra
export const deleteExtra = createAsyncThunk(
  'extra/deleteExtra',
  async (extraId: number, { dispatch }) => {
    try {
      dispatch(setExtraLoading(true));
      dispatch(setExtraSuccess(false));
      dispatch(setExtraError(null));

      const response = await axios.delete(`/api/extras/delete/${extraId}`);
      if (response.data) {
        dispatch(setExtraSuccess(true));
        dispatch(getExtraList());
      } else {
        dispatch(setExtraError("Delete extra failed!"));
      }
    } catch (error) {
      dispatch(setExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setExtraLoading(false));
    }
  }
);

// Action thunk pour modifier un extra
export const editExtra = createAsyncThunk(
  'extra/editExtra',
  async ({ extraId, extraData }: { extraId: number; extraData: Partial<IExtra> }, { dispatch }) => {
    try {
      dispatch(setExtraLoading(true));
      dispatch(setExtraSuccess(false));
      dispatch(setExtraError(null));

      const response = await axios.put(`/api/extras/edit/${extraId}`, extraData);
      if (response.data) {
        dispatch(setExtraSuccess(true));
        dispatch(getExtraList());
      } else {
        dispatch(setExtraError("Edit extra failed!"));
      }
    } catch (error) {
      dispatch(setExtraError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setExtraLoading(false));
    }
  }
);

export default extraSlice.reducer;
