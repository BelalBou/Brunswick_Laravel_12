import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux.d";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface ServerTimeState {
  currentTime: string | null;
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
    setServerTime: (state, action: PayloadAction<string>) => {
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
      dispatch(setServerTimeSuccess(false));

      const response = await axios.get('/api/server/time');
      
      if (response.data) {
        dispatch(setServerTime(response.data.currentTime));
        dispatch(setServerTimeSuccess(true));
        return response.data;
      } else {
        dispatch(setServerTimeError('Failed to get server time'));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while getting server time';
      dispatch(setServerTimeError(errorMessage));
      return null;
    } finally {
      dispatch(setServerTimeLoading(false));
    }
  }
);

export default serverTimeSlice.reducer;