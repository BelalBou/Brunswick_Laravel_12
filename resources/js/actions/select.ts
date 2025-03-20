import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import ISelect from "../interfaces/ISelect";

export interface SelectState {
  list: ISelect[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SelectState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    setSelectList: (state, action: PayloadAction<ISelect[]>) => {
      state.list = action.payload;
    },
    setSelectListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setSelectLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetSelectState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setSelectList,
  setSelectListTotalCount,
  setSelectLoading,
  setSelectError,
  setSelectSuccess,
  resetSelectState
} = selectSlice.actions;

// Action thunk pour récupérer la liste des sélections
export const getSelectList = createAsyncThunk(
  'select/getSelectList',
  async (_, { dispatch }) => {
    try {
      dispatch(setSelectLoading(true));
      dispatch(setSelectError(null));

      const response = await axios.get(`/api/selects/list/`);
      if (response.data.data) {
        dispatch(setSelectList(response.data.data));
        dispatch(setSelectListTotalCount(response.data.total));
      } else {
        dispatch(setSelectError("Get select list failed!"));
      }
    } catch (error) {
      dispatch(setSelectError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSelectLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des sélections avec pagination
export const getSelectListWithPagination = createAsyncThunk(
  'select/getSelectListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setSelectLoading(true));
      dispatch(setSelectError(null));

      const response = await axios.get(`/api/selects/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setSelectList(response.data.data));
        dispatch(setSelectListTotalCount(response.data.total));
      } else {
        dispatch(setSelectError("Get select list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setSelectError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSelectLoading(false));
    }
  }
);

// Action thunk pour ajouter une sélection
export const addSelect = createAsyncThunk(
  'select/addSelect',
  async (selectData: Partial<ISelect>, { dispatch }) => {
    try {
      dispatch(setSelectLoading(true));
      dispatch(setSelectSuccess(false));
      dispatch(setSelectError(null));

      const response = await axios.post(`/api/selects/add/`, selectData);
      if (response.data) {
        dispatch(setSelectSuccess(true));
        dispatch(getSelectList());
      } else {
        dispatch(setSelectError("Add select failed!"));
      }
    } catch (error) {
      dispatch(setSelectError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSelectLoading(false));
    }
  }
);

// Action thunk pour supprimer une sélection
export const deleteSelect = createAsyncThunk(
  'select/deleteSelect',
  async (selectId: number, { dispatch }) => {
    try {
      dispatch(setSelectLoading(true));
      dispatch(setSelectSuccess(false));
      dispatch(setSelectError(null));

      const response = await axios.delete(`/api/selects/delete/${selectId}`);
      if (response.data) {
        dispatch(setSelectSuccess(true));
        dispatch(getSelectList());
      } else {
        dispatch(setSelectError("Delete select failed!"));
      }
    } catch (error) {
      dispatch(setSelectError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSelectLoading(false));
    }
  }
);

// Action thunk pour modifier une sélection
export const editSelect = createAsyncThunk(
  'select/editSelect',
  async ({ selectId, selectData }: { selectId: number; selectData: Partial<ISelect> }, { dispatch }) => {
    try {
      dispatch(setSelectLoading(true));
      dispatch(setSelectSuccess(false));
      dispatch(setSelectError(null));

      const response = await axios.put(`/api/selects/edit/${selectId}`, selectData);
      if (response.data) {
        dispatch(setSelectSuccess(true));
        dispatch(getSelectList());
      } else {
        dispatch(setSelectError("Edit select failed!"));
      }
    } catch (error) {
      dispatch(setSelectError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSelectLoading(false));
    }
  }
);

export default selectSlice.reducer; 