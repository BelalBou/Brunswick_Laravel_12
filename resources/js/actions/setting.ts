import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import ISetting from "../interfaces/ISetting";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface SettingState {
  list: ISetting[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SettingState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSettingList: (state, action: PayloadAction<ISetting[]>) => {
      state.list = action.payload;
    },
    setSettingListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setSettingLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSettingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSettingSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetSettingState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setSettingList,
  setSettingListTotalCount,
  setSettingLoading,
  setSettingError,
  setSettingSuccess,
  resetSettingState
} = settingSlice.actions;

// Action thunk pour récupérer la liste des paramètres
export const getSettingList = createAsyncThunk(
  'setting/getSettingList',
  async (_, { dispatch }) => {
    try {
      dispatch(setSettingLoading(true));
      dispatch(setSettingError(null));

      const response = await axios.get(`/api/settings/list/`);
      if (response.data.data) {
        dispatch(setSettingList(response.data.data));
        dispatch(setSettingListTotalCount(response.data.total));
      } else {
        dispatch(setSettingError("Get setting list failed!"));
      }
    } catch (error) {
      dispatch(setSettingError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSettingLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des paramètres avec pagination
export const getSettingListWithPagination = createAsyncThunk(
  'setting/getSettingListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setSettingLoading(true));
      dispatch(setSettingError(null));

      const response = await axios.get(`/api/settings/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setSettingList(response.data.data));
        dispatch(setSettingListTotalCount(response.data.total));
      } else {
        dispatch(setSettingError("Get setting list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setSettingError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSettingLoading(false));
    }
  }
);

// Action thunk pour ajouter un paramètre
export const addSetting = createAsyncThunk(
  'setting/addSetting',
  async (settingData: Partial<ISetting>, { dispatch }) => {
    try {
      dispatch(setSettingLoading(true));
      dispatch(setSettingSuccess(false));
      dispatch(setSettingError(null));

      const response = await axios.post(`/api/settings/add/`, settingData);
      if (response.data) {
        dispatch(setSettingSuccess(true));
        dispatch(getSettingList());
      } else {
        dispatch(setSettingError("Add setting failed!"));
      }
    } catch (error) {
      dispatch(setSettingError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSettingLoading(false));
    }
  }
);

// Action thunk pour supprimer un paramètre
export const deleteSetting = createAsyncThunk(
  'setting/deleteSetting',
  async (settingId: number, { dispatch }) => {
    try {
      dispatch(setSettingLoading(true));
      dispatch(setSettingSuccess(false));
      dispatch(setSettingError(null));

      const response = await axios.delete(`/api/settings/delete/${settingId}`);
      if (response.data) {
        dispatch(setSettingSuccess(true));
        dispatch(getSettingList());
      } else {
        dispatch(setSettingError("Delete setting failed!"));
      }
    } catch (error) {
      dispatch(setSettingError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSettingLoading(false));
    }
  }
);

// Action thunk pour modifier un paramètre
export const editSetting = createAsyncThunk(
  'setting/editSetting',
  async ({ settingId, settingData }: { settingId: number; settingData: Partial<ISetting> }, { dispatch }) => {
    try {
      dispatch(setSettingLoading(true));
      dispatch(setSettingSuccess(false));
      dispatch(setSettingError(null));

      const response = await axios.put(`/api/settings/edit/${settingId}`, settingData);
      if (response.data) {
        dispatch(setSettingSuccess(true));
        dispatch(getSettingList());
      } else {
        dispatch(setSettingError("Edit setting failed!"));
      }
    } catch (error) {
      dispatch(setSettingError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSettingLoading(false));
    }
  }
);

export default settingSlice.reducer;
