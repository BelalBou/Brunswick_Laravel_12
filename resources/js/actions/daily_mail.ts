import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import IDailyMail from "../interfaces/IDailyMail";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface DailyMailState {
  list: IDailyMail[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DailyMailState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const dailyMailSlice = createSlice({
  name: 'dailyMail',
  initialState,
  reducers: {
    setDailyMailList: (state, action: PayloadAction<IDailyMail[]>) => {
      state.list = action.payload;
    },
    setDailyMailListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setDailyMailLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDailyMailError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDailyMailSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetDailyMailState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setDailyMailList,
  setDailyMailListTotalCount,
  setDailyMailLoading,
  setDailyMailError,
  setDailyMailSuccess,
  resetDailyMailState
} = dailyMailSlice.actions;

// Action thunk pour récupérer la liste des emails quotidiens
export const getDailyMailList = createAsyncThunk(
  'dailyMail/getDailyMailList',
  async (_, { dispatch }) => {
    try {
      dispatch(setDailyMailLoading(true));
      dispatch(setDailyMailError(null));

      const response = await axios.get(`/api/daily_mails/list/`);
      if (response.data.data) {
        dispatch(setDailyMailList(response.data.data));
        dispatch(setDailyMailListTotalCount(response.data.total));
      } else {
        dispatch(setDailyMailError("Get daily mail list failed!"));
      }
    } catch (error) {
      dispatch(setDailyMailError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setDailyMailLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des emails quotidiens avec pagination
export const getDailyMailListWithPagination = createAsyncThunk(
  'dailyMail/getDailyMailListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setDailyMailLoading(true));
      dispatch(setDailyMailError(null));

      const response = await axios.get(`/api/daily_mails/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setDailyMailList(response.data.data));
        dispatch(setDailyMailListTotalCount(response.data.total));
      } else {
        dispatch(setDailyMailError("Get daily mail list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setDailyMailError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setDailyMailLoading(false));
    }
  }
);

// Action thunk pour ajouter un email quotidien
export const addDailyMail = createAsyncThunk(
  'dailyMail/addDailyMail',
  async (dailyMailData: Partial<IDailyMail>, { dispatch }) => {
    try {
      dispatch(setDailyMailLoading(true));
      dispatch(setDailyMailSuccess(false));
      dispatch(setDailyMailError(null));

      const response = await axios.post(`/api/daily_mails/add/`, dailyMailData);
      if (response.data) {
        dispatch(setDailyMailSuccess(true));
        dispatch(getDailyMailList());
      } else {
        dispatch(setDailyMailError("Add daily mail failed!"));
      }
    } catch (error) {
      dispatch(setDailyMailError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setDailyMailLoading(false));
    }
  }
);

// Action thunk pour supprimer un email quotidien
export const deleteDailyMail = createAsyncThunk(
  'dailyMail/deleteDailyMail',
  async (dailyMailId: number, { dispatch }) => {
    try {
      dispatch(setDailyMailLoading(true));
      dispatch(setDailyMailSuccess(false));
      dispatch(setDailyMailError(null));

      const response = await axios.delete(`/api/daily_mails/delete/${dailyMailId}`);
      if (response.data) {
        dispatch(setDailyMailSuccess(true));
        dispatch(getDailyMailList());
      } else {
        dispatch(setDailyMailError("Delete daily mail failed!"));
      }
    } catch (error) {
      dispatch(setDailyMailError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setDailyMailLoading(false));
    }
  }
);

// Action thunk pour modifier un email quotidien
export const editDailyMail = createAsyncThunk(
  'dailyMail/editDailyMail',
  async ({ dailyMailId, dailyMailData }: { dailyMailId: number; dailyMailData: Partial<IDailyMail> }, { dispatch }) => {
    try {
      dispatch(setDailyMailLoading(true));
      dispatch(setDailyMailSuccess(false));
      dispatch(setDailyMailError(null));

      const response = await axios.put(`/api/daily_mails/edit/${dailyMailId}`, dailyMailData);
      if (response.data) {
        dispatch(setDailyMailSuccess(true));
        dispatch(getDailyMailList());
      } else {
        dispatch(setDailyMailError("Edit daily mail failed!"));
      }
    } catch (error) {
      dispatch(setDailyMailError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setDailyMailLoading(false));
    }
  }
);

export default dailyMailSlice.reducer;
