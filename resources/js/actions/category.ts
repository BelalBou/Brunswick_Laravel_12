import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import ICategory from "../interfaces/ICategory";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface CategoryState {
  list: ICategory[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CategoryState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryList: (state, action: PayloadAction<ICategory[]>) => {
      state.list = action.payload;
    },
    setCategoryListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCategoryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCategorySuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetCategoryState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setCategoryList,
  setCategoryListTotalCount,
  setCategoryLoading,
  setCategoryError,
  setCategorySuccess,
  resetCategoryState
} = categorySlice.actions;

// Action thunk pour récupérer la liste des catégories
export const getCategoryList = createAsyncThunk(
  'category/getCategoryList',
  async (_, { dispatch }) => {
    try {
      dispatch(setCategoryLoading(true));
      dispatch(setCategoryError(null));

      const response = await axios.get(`/api/categories/list/`);
      if (response.data.data) {
        dispatch(setCategoryList(response.data.data));
        dispatch(setCategoryListTotalCount(response.data.total));
      } else {
        dispatch(setCategoryError("Get category list failed!"));
      }
    } catch (error) {
      dispatch(setCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setCategoryLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des catégories avec pagination
export const getCategoryListWithPagination = createAsyncThunk(
  'category/getCategoryListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setCategoryLoading(true));
      dispatch(setCategoryError(null));

      const response = await axios.get(`/api/categories/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setCategoryList(response.data.data));
        dispatch(setCategoryListTotalCount(response.data.total));
      } else {
        dispatch(setCategoryError("Get category list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setCategoryLoading(false));
    }
  }
);

// Action thunk pour ajouter une catégorie
export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (categoryData: Partial<ICategory>, { dispatch }) => {
    try {
      dispatch(setCategoryLoading(true));
      dispatch(setCategorySuccess(false));
      dispatch(setCategoryError(null));

      const response = await axios.post(`/api/categories/add/`, categoryData);
      if (response.data) {
        dispatch(setCategorySuccess(true));
        dispatch(getCategoryList());
      } else {
        dispatch(setCategoryError("Add category failed!"));
      }
    } catch (error) {
      dispatch(setCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setCategoryLoading(false));
    }
  }
);

// Action thunk pour supprimer une catégorie
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId: number, { dispatch }) => {
    try {
      dispatch(setCategoryLoading(true));
      dispatch(setCategorySuccess(false));
      dispatch(setCategoryError(null));

      const response = await axios.delete(`/api/categories/delete/${categoryId}`);
      if (response.data) {
        dispatch(setCategorySuccess(true));
        dispatch(getCategoryList());
      } else {
        dispatch(setCategoryError("Delete category failed!"));
      }
    } catch (error) {
      dispatch(setCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setCategoryLoading(false));
    }
  }
);

// Action thunk pour modifier une catégorie
export const editCategory = createAsyncThunk(
  'category/editCategory',
  async ({ categoryId, categoryData }: { categoryId: number; categoryData: Partial<ICategory> }, { dispatch }) => {
    try {
      dispatch(setCategoryLoading(true));
      dispatch(setCategorySuccess(false));
      dispatch(setCategoryError(null));

      const response = await axios.put(`/api/categories/edit/${categoryId}`, categoryData);
      if (response.data) {
        dispatch(setCategorySuccess(true));
        dispatch(getCategoryList());
      } else {
        dispatch(setCategoryError("Edit category failed!"));
      }
    } catch (error) {
      dispatch(setCategoryError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setCategoryLoading(false));
    }
  }
);

export default categorySlice.reducer;
