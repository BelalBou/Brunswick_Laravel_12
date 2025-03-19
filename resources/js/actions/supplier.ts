import axios, { AxiosResponse } from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import ISupplier from "../interfaces/ISupplier";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";
import moment from "moment";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface SupplierState {
  list: ISupplier[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SupplierState = {
  list: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSupplierList: (state, action: PayloadAction<ISupplier[]>) => {
      state.list = action.payload;
    },
    setSupplierListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setSupplierLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSupplierError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSupplierSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetSupplierState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setSupplierList,
  setSupplierListTotalCount,
  setSupplierLoading,
  setSupplierError,
  setSupplierSuccess,
  resetSupplierState
} = supplierSlice.actions;

// Action thunk pour récupérer la liste des fournisseurs
export const getSupplierList = createAsyncThunk(
  'supplier/getSupplierList',
  async (_, { dispatch }) => {
    try {
      dispatch(setSupplierLoading(true));
      dispatch(setSupplierError(null));

      const response = await axios.get(`/api/suppliers/list/`);
      if (response.data.data) {
        dispatch(setSupplierList(response.data.data));
        dispatch(setSupplierListTotalCount(response.data.total));
      } else {
        dispatch(setSupplierError("Get supplier list failed!"));
      }
    } catch (error) {
      dispatch(setSupplierError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSupplierLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des fournisseurs avec pagination
export const getSupplierListWithPagination = createAsyncThunk(
  'supplier/getSupplierListWithPagination',
  async ({ limit, offset }: { limit: number; offset: number }, { dispatch }) => {
    try {
      dispatch(setSupplierLoading(true));
      dispatch(setSupplierError(null));

      const response = await axios.get(`/api/suppliers/list/`, {
        params: { limit, offset }
      });
      if (response.data.data) {
        dispatch(setSupplierList(response.data.data));
        dispatch(setSupplierListTotalCount(response.data.total));
      } else {
        dispatch(setSupplierError("Get supplier list with pagination failed!"));
      }
    } catch (error) {
      dispatch(setSupplierError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSupplierLoading(false));
    }
  }
);

// Action thunk pour ajouter un fournisseur
export const addSupplier = createAsyncThunk(
  'supplier/addSupplier',
  async (supplierData: Partial<ISupplier>, { dispatch }) => {
    try {
      dispatch(setSupplierLoading(true));
      dispatch(setSupplierSuccess(false));
      dispatch(setSupplierError(null));

      const response = await axios.post(`/api/suppliers/add/`, supplierData);
      if (response.data) {
        dispatch(setSupplierSuccess(true));
        dispatch(getSupplierList());
      } else {
        dispatch(setSupplierError("Add supplier failed!"));
      }
    } catch (error) {
      dispatch(setSupplierError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSupplierLoading(false));
    }
  }
);

// Action thunk pour supprimer un fournisseur
export const deleteSupplier = createAsyncThunk(
  'supplier/deleteSupplier',
  async (supplierId: number, { dispatch }) => {
    try {
      dispatch(setSupplierLoading(true));
      dispatch(setSupplierSuccess(false));
      dispatch(setSupplierError(null));

      const response = await axios.delete(`/api/suppliers/delete/${supplierId}`);
      if (response.data) {
        dispatch(setSupplierSuccess(true));
        dispatch(getSupplierList());
      } else {
        dispatch(setSupplierError("Delete supplier failed!"));
      }
    } catch (error) {
      dispatch(setSupplierError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSupplierLoading(false));
    }
  }
);

// Action thunk pour modifier un fournisseur
export const editSupplier = createAsyncThunk(
  'supplier/editSupplier',
  async ({ supplierId, supplierData }: { supplierId: number; supplierData: Partial<ISupplier> }, { dispatch }) => {
    try {
      dispatch(setSupplierLoading(true));
      dispatch(setSupplierSuccess(false));
      dispatch(setSupplierError(null));

      const response = await axios.put(`/api/suppliers/edit/${supplierId}`, supplierData);
      if (response.data) {
        dispatch(setSupplierSuccess(true));
        dispatch(getSupplierList());
      } else {
        dispatch(setSupplierError("Edit supplier failed!"));
      }
    } catch (error) {
      dispatch(setSupplierError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSupplierLoading(false));
    }
  }
);

// Action thunk pour récupérer la liste des fournisseurs admin
export const getSuppliersAdmin = createAsyncThunk(
  'supplier/getSuppliersAdmin',
  async (_, { dispatch }) => {
    try {
      dispatch(setSupplierLoading(true));
      dispatch(setSupplierError(null));

      const response = await axios.get(`/api/suppliers/list/?admin=1`);
      if (response.data.data) {
        dispatch(setSupplierList(response.data.data));
        dispatch(setSupplierListTotalCount(response.data.total));
      } else {
        dispatch(setSupplierError("Get admin supplier list failed!"));
      }
    } catch (error) {
      dispatch(setSupplierError(error instanceof Error ? error.message : "An error occurred"));
    } finally {
      dispatch(setSupplierLoading(false));
    }
  }
);

export default supplierSlice.reducer;