import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// authentication
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface Dictionary {
  id: number;
  name: string;
  value: string;
  language: string;
}

export interface DictionaryState {
  list: Dictionary[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DictionaryState = {
  list: [],
  isLoading: false,
  error: null,
  success: false
};

const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    setDictionaryList: (state, action: PayloadAction<Dictionary[]>) => {
      state.list = action.payload;
    },
    setDictionaryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDictionaryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDictionarySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetDictionaryState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setDictionaryList,
  setDictionaryLoading,
  setDictionaryError,
  setDictionarySuccess,
  resetDictionaryState
} = dictionarySlice.actions;

export const getDictionaries = createAsyncThunk(
  'dictionary/getDictionaries',
  async (_, { dispatch }) => {
    try {
      dispatch(setDictionaryLoading(true));
      dispatch(setDictionarySuccess(false));
      dispatch(setDictionaryError(null));
      
      const response = await axios.get('/api/dictionnaries/list/');
      
      if (response.data) {
        dispatch(setDictionaryList(response.data));
        dispatch(setDictionarySuccess(true));
      } else {
        dispatch(setDictionaryError("List dictionaries failed!"));
      }
      
      return response.data;
    } catch (error) {
      dispatch(setDictionaryError(error instanceof Error ? error.message : "An error occurred"));
      throw error;
    } finally {
      dispatch(setDictionaryLoading(false));
    }
  }
);

export default dictionarySlice.reducer;
