import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import IMenuSize from "../interfaces/IMenuSize";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface MenuSizeState {
  list: IMenuSize[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MenuSizeState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const menuSizeSlice = createSlice({
  name: 'menuSize',
  initialState,
  reducers: {
    setMenuSizeList: (state, action: PayloadAction<IMenuSize[]>) => {
      state.list = action.payload;
    },
    setMenuSizeListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setMenuSizeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMenuSizeError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMenuSizeSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetMenuSizeState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setMenuSizeList,
  setMenuSizeListTotalCount,
  setMenuSizeLoading,
  setMenuSizeError,
  setMenuSizeSuccess,
  resetMenuSizeState
} = menuSizeSlice.actions;

// Action thunk pour récupérer la liste des tailles de menu
export const getMenuSizeList = createAsyncThunk(
  'menuSize/getMenuSizeList',
  async (_, { dispatch }) => {
    try {
      dispatch(setMenuSizeLoading(true));
      dispatch(setMenuSizeError(null));

      const response = await axios.get(`/api/menu_sizes/list/`);
      if (response.data.data) {
        dispatch(setMenuSizeList(response.data.data));
        dispatch(setMenuSizeListTotalCount(response.data.total));
      } else {
        dispatch(setMenuSizeError("Get menu size list failed!"));
      }
    } catch (error) {
      dispatch(setMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuSizeLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des tailles de menu avec pagination
export const getMenuSizeListWithPagination = createAsyncThunk(
  'menuSize/getMenuSizeListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setMenuSizeLoading(true));
      dispatch(setMenuSizeError(null));

      const response = await axios.get(`/api/menu_sizes/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setMenuSizeList(response.data.data));
        dispatch(setMenuSizeListTotalCount(response.data.total));
      } else {
        dispatch(setMenuSizeError("Get menu size list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuSizeLoading(false));
    }
  }
);

// Action thunk pour ajouter une taille de menu
export const addMenuSize = createAsyncThunk(
  'menuSize/addMenuSize',
  async (menuSizeData: Partial<IMenuSize>, { dispatch }) => {
    try {
      dispatch(setMenuSizeLoading(true));
      dispatch(setMenuSizeSuccess(false));
      dispatch(setMenuSizeError(null));

      const response = await axios.post(`/api/menu_sizes/add/`, menuSizeData);
      if (response.data) {
        dispatch(setMenuSizeSuccess(true));
        dispatch(getMenuSizeList());
      } else {
        dispatch(setMenuSizeError("Add menu size failed!"));
      }
    } catch (error) {
      dispatch(setMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuSizeLoading(false));
    }
  }
);

// Action thunk pour supprimer une taille de menu
export const deleteMenuSize = createAsyncThunk(
  'menuSize/deleteMenuSize',
  async (menuSizeId: number, { dispatch }) => {
    try {
      dispatch(setMenuSizeLoading(true));
      dispatch(setMenuSizeSuccess(false));
      dispatch(setMenuSizeError(null));

      const response = await axios.delete(`/api/menu_sizes/delete/${menuSizeId}`);
      if (response.data) {
        dispatch(setMenuSizeSuccess(true));
        dispatch(getMenuSizeList());
      } else {
        dispatch(setMenuSizeError("Delete menu size failed!"));
      }
    } catch (error) {
      dispatch(setMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuSizeLoading(false));
    }
  }
);

// Action thunk pour modifier une taille de menu
export const editMenuSize = createAsyncThunk(
  'menuSize/editMenuSize',
  async ({ menuSizeId, menuSizeData }: { menuSizeId: number; menuSizeData: Partial<IMenuSize> }, { dispatch }) => {
    try {
      dispatch(setMenuSizeLoading(true));
      dispatch(setMenuSizeSuccess(false));
      dispatch(setMenuSizeError(null));

      const response = await axios.put(`/api/menu_sizes/edit/${menuSizeId}`, menuSizeData);
      if (response.data) {
        dispatch(setMenuSizeSuccess(true));
        dispatch(getMenuSizeList());
      } else {
        dispatch(setMenuSizeError("Edit menu size failed!"));
      }
    } catch (error) {
      dispatch(setMenuSizeError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuSizeLoading(false));
    }
  }
);

export default menuSizeSlice.reducer;
