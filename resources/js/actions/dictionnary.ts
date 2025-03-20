import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// authentication
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface Dictionary {
  id: number;
  tag: string;
  translation_fr: string;
  translation_en: string;
  deleted: boolean;
  created_at?: string;
  updated_at?: string;
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
    setDictionaryList: (state, action: PayloadAction<any>) => {
      if (Array.isArray(action.payload)) {
        state.list = action.payload;
      } else {
        console.error('setDictionaryList a reçu des données non-tableau:', action.payload);
        state.list = [];
        state.error = 'Format de données incorrect';
      }
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
      
      const response = await axios.get('/api/dictionaries', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        dispatch(setDictionaryList(response.data));
        dispatch(setDictionarySuccess(true));
      } else {
        console.error('Format de réponse incorrect pour les dictionnaires:', response);
        dispatch(setDictionaryList([]));
        dispatch(setDictionaryError('Format de réponse incorrect'));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des dictionnaires:', error);
      dispatch(setDictionaryError(error.message || 'Une erreur est survenue'));
      dispatch(setDictionaryList([]));
      throw error;
    } finally {
      dispatch(setDictionaryLoading(false));
    }
  }
);

export default dictionarySlice.reducer;
