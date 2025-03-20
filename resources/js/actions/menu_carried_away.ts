import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IMenuCarriedAway from "../interfaces/IMenuCarriedAway";

export interface MenuCarriedAwayState {
  list: IMenuCarriedAway[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MenuCarriedAwayState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const menuCarriedAwaySlice = createSlice({
  name: 'menuCarriedAway',
  initialState,
  reducers: {
    setMenuCarriedAwayList: (state, action: PayloadAction<IMenuCarriedAway[]>) => {
      state.list = action.payload;
    },
    setMenuCarriedAwayListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setMenuCarriedAwayLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMenuCarriedAwayError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMenuCarriedAwaySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetMenuCarriedAwayState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setMenuCarriedAwayList,
  setMenuCarriedAwayListTotalCount,
  setMenuCarriedAwayLoading,
  setMenuCarriedAwayError,
  setMenuCarriedAwaySuccess,
  resetMenuCarriedAwayState
} = menuCarriedAwaySlice.actions;

// Action thunk pour récupérer la liste des menus à emporter
export const getMenuCarriedAwayList = createAsyncThunk(
  'menuCarriedAway/getMenuCarriedAwayList',
  async (_, { dispatch }) => {
    try {
      dispatch(setMenuCarriedAwayLoading(true));
      dispatch(setMenuCarriedAwayError(null));

      const response = await axios.get(`/api/menu_carried_away/list/`);
      if (response.data.data) {
        dispatch(setMenuCarriedAwayList(response.data.data));
        dispatch(setMenuCarriedAwayListTotalCount(response.data.total));
      } else {
        dispatch(setMenuCarriedAwayError("Get menu carried away list failed!"));
      }
    } catch (error) {
      dispatch(setMenuCarriedAwayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuCarriedAwayLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des menus à emporter avec pagination
export const getMenuCarriedAwayListWithPagination = createAsyncThunk(
  'menuCarriedAway/getMenuCarriedAwayListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setMenuCarriedAwayLoading(true));
      dispatch(setMenuCarriedAwayError(null));

      const response = await axios.get(`/api/menu_carried_away/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setMenuCarriedAwayList(response.data.data));
        dispatch(setMenuCarriedAwayListTotalCount(response.data.total));
      } else {
        dispatch(setMenuCarriedAwayError("Get menu carried away list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setMenuCarriedAwayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuCarriedAwayLoading(false));
    }
  }
);

// Action thunk pour ajouter un menu à emporter
export const addMenuCarriedAway = createAsyncThunk(
  'menuCarriedAway/addMenuCarriedAway',
  async (menuCarriedAwayData: Partial<IMenuCarriedAway>, { dispatch }) => {
    try {
      dispatch(setMenuCarriedAwayLoading(true));
      dispatch(setMenuCarriedAwaySuccess(false));
      dispatch(setMenuCarriedAwayError(null));

      const response = await axios.post(`/api/menu_carried_away/add/`, menuCarriedAwayData);
      if (response.data) {
        dispatch(setMenuCarriedAwaySuccess(true));
        dispatch(getMenuCarriedAwayList());
      } else {
        dispatch(setMenuCarriedAwayError("Add menu carried away failed!"));
      }
    } catch (error) {
      dispatch(setMenuCarriedAwayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuCarriedAwayLoading(false));
    }
  }
);

// Action thunk pour supprimer un menu à emporter
export const deleteMenuCarriedAway = createAsyncThunk(
  'menuCarriedAway/deleteMenuCarriedAway',
  async (menuCarriedAwayId: number, { dispatch }) => {
    try {
      dispatch(setMenuCarriedAwayLoading(true));
      dispatch(setMenuCarriedAwaySuccess(false));
      dispatch(setMenuCarriedAwayError(null));

      const response = await axios.delete(`/api/menu_carried_away/delete/${menuCarriedAwayId}`);
      if (response.data) {
        dispatch(setMenuCarriedAwaySuccess(true));
        dispatch(getMenuCarriedAwayList());
      } else {
        dispatch(setMenuCarriedAwayError("Delete menu carried away failed!"));
      }
    } catch (error) {
      dispatch(setMenuCarriedAwayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuCarriedAwayLoading(false));
    }
  }
);

// Action thunk pour modifier un menu à emporter
export const editMenuCarriedAway = createAsyncThunk(
  'menuCarriedAway/editMenuCarriedAway',
  async ({ menuCarriedAwayId, menuCarriedAwayData }: { menuCarriedAwayId: number; menuCarriedAwayData: Partial<IMenuCarriedAway> }, { dispatch }) => {
    try {
      dispatch(setMenuCarriedAwayLoading(true));
      dispatch(setMenuCarriedAwaySuccess(false));
      dispatch(setMenuCarriedAwayError(null));

      const response = await axios.put(`/api/menu_carried_away/edit/${menuCarriedAwayId}`, menuCarriedAwayData);
      if (response.data) {
        dispatch(setMenuCarriedAwaySuccess(true));
        dispatch(getMenuCarriedAwayList());
      } else {
        dispatch(setMenuCarriedAwayError("Edit menu carried away failed!"));
      }
    } catch (error) {
      dispatch(setMenuCarriedAwayError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuCarriedAwayLoading(false));
    }
  }
);

export default menuCarriedAwaySlice.reducer; 