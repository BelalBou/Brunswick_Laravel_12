import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IMenu from "../interfaces/IMenu";
import IMenuSize from "../interfaces/IMenuSize";
import IExtra from "../interfaces/IExtra";
import IAllergy from "../interfaces/IAllergy";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface MenuState {
  list: IMenu[];
  listSpread: IMenu[];
  listSize: IMenuSize[];
  listExtra: IExtra[];
  listAllergy: IAllergy[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MenuState = {
  list: [],
  listSpread: [],
  listSize: [],
  listExtra: [],
  listAllergy: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList: (state, action: PayloadAction<IMenu[]>) => {
      state.list = action.payload;
    },
    setMenuListSpread: (state, action: PayloadAction<IMenu[]>) => {
      state.listSpread = action.payload;
    },
    setMenuListSize: (state, action: PayloadAction<IMenuSize[]>) => {
      state.listSize = action.payload;
    },
    setMenuListExtra: (state, action: PayloadAction<IExtra[]>) => {
      state.listExtra = action.payload;
    },
    setMenuListAllergy: (state, action: PayloadAction<IAllergy[]>) => {
      state.listAllergy = action.payload;
    },
    setMenuListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setMenuLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMenuError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMenuSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetMenuState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setMenuList,
  setMenuListSpread,
  setMenuListSize,
  setMenuListExtra,
  setMenuListAllergy,
  setMenuListTotalCount,
  setMenuLoading,
  setMenuError,
  setMenuSuccess,
  resetMenuState
} = menuSlice.actions;

// Action thunk pour récupérer la liste des menus
export const getMenuList = createAsyncThunk(
  'menu/getMenuList',
  async (_, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuError(null));

      const response = await axios.get(`/api/menu/list/`);
      if (response.data.data) {
        dispatch(setMenuList(response.data.data));
        dispatch(setMenuListTotalCount(response.data.total));
      } else {
        dispatch(setMenuError("Get menu list failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des menus avec pagination
export const getMenuListWithPagination = createAsyncThunk(
  'menu/getMenuListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuError(null));

      const response = await axios.get(`/api/menu/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setMenuList(response.data.data));
        dispatch(setMenuListTotalCount(response.data.total));
      } else {
        dispatch(setMenuError("Get menu list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des menus par catégorie
export const getMenuListByCategory = createAsyncThunk(
  'menu/getMenuListByCategory',
  async ({ categoryId, limit, offset }: { categoryId: number; limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuError(null));

      const response = await axios.get(`/api/menu/list/category/${categoryId}`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setMenuList(response.data.data));
        dispatch(setMenuListTotalCount(response.data.total));
      } else {
        dispatch(setMenuError("Get menu list by category failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des menus par fournisseur
export const getMenuListBySupplier = createAsyncThunk(
  'menu/getMenuListBySupplier',
  async ({ supplierId, limit, offset }: { supplierId: number; limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuError(null));

      const response = await axios.get(`/api/menu/list/supplier/${supplierId}`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setMenuList(response.data.data));
        dispatch(setMenuListTotalCount(response.data.total));
      } else {
        dispatch(setMenuError("Get menu list by supplier failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

// Action thunk pour ajouter un menu
export const addMenu = createAsyncThunk(
  'menu/addMenu',
  async (menuData: Partial<IMenu>, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuSuccess(false));
      dispatch(setMenuError(null));

      const response = await axios.post(`/api/menu/add/`, menuData);
      if (response.data) {
        dispatch(setMenuSuccess(true));
        dispatch(getMenuList());
      } else {
        dispatch(setMenuError("Add menu failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

// Action thunk pour supprimer un menu
export const deleteMenu = createAsyncThunk(
  'menu/deleteMenu',
  async (menuId: number, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuSuccess(false));
      dispatch(setMenuError(null));

      const response = await axios.delete(`/api/menu/delete/${menuId}`);
      if (response.data) {
        dispatch(setMenuSuccess(true));
        dispatch(getMenuList());
      } else {
        dispatch(setMenuError("Delete menu failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

// Action thunk pour modifier un menu
export const editMenu = createAsyncThunk(
  'menu/editMenu',
  async ({ menuId, menuData }: { menuId: number; menuData: Partial<IMenu> }, { dispatch }) => {
    try {
      dispatch(setMenuLoading(true));
      dispatch(setMenuSuccess(false));
      dispatch(setMenuError(null));

      const response = await axios.put(`/api/menu/edit/${menuId}`, menuData);
      if (response.data) {
        dispatch(setMenuSuccess(true));
        dispatch(getMenuList());
      } else {
        dispatch(setMenuError("Edit menu failed!"));
      }
    } catch (error) {
      dispatch(setMenuError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setMenuLoading(false));
    }
  }
);

export default menuSlice.reducer;
