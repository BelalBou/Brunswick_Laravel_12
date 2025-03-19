import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import moment from "moment";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface ServerTimeState {
  currentTime: moment.Moment | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ServerTimeState = {
  currentTime: null,
  isLoading: false,
  error: null,
  success: false
};

const serverTimeSlice = createSlice({
  name: 'serverTime',
  initialState,
  reducers: {
    setServerTime: (state, action: PayloadAction<moment.Moment>) => {
      state.currentTime = action.payload;
    },
    setServerTimeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setServerTimeError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setServerTimeSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetServerTimeState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setServerTime,
  setServerTimeLoading,
  setServerTimeError,
  setServerTimeSuccess,
  resetServerTimeState
} = serverTimeSlice.actions;

// Action thunk pour récupérer le temps serveur
export const getServerTime = createAsyncThunk(
  'serverTime/getServerTime',
  async (_, { dispatch }) => {
    try {
      dispatch(setServerTimeLoading(true));
      dispatch(setServerTimeError(null));

      const response = await axios.get(`/api/server_time/`);
      if (response.data) {
        dispatch(setServerTime(moment(response.data)));
        dispatch(setServerTimeSuccess(true));
      } else {
        dispatch(setServerTimeError("Get server time failed!"));
      }
    } catch (error) {
      dispatch(setServerTimeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setServerTimeLoading(false));
    }
  }
);

export default serverTimeSlice.reducer;