import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux";
import IOrder from "../interfaces/IOrder";
import IOrderExtra from "../interfaces/IOrderExtra";
import { setCartList } from "./cart";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface OrderState {
  list: IOrder[];
  listSpread: IOrder[];
  extraList: IOrderExtra[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  list: [],
  listSpread: [],
  extraList: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  success: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderList: (state, action: PayloadAction<IOrder[]>) => {
      state.list = action.payload;
    },
    setOrderListSpread: (state, action: PayloadAction<IOrder[]>) => {
      state.listSpread = action.payload;
    },
    setOrderExtraList: (state, action: PayloadAction<IOrderExtra[]>) => {
      state.extraList = action.payload;
    },
    setOrderListTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrderSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetOrderState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setOrderList,
  setOrderListSpread,
  setOrderExtraList,
  setOrderListTotalCount,
  setOrderLoading,
  setOrderError,
  setOrderSuccess,
  resetOrderState
} = orderSlice.actions;

// Action thunk pour récupérer les commandes d'un client
export const getOrdersForCustomer = (limit: number = 0, offset: number = 0) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/customer/`, {
      params: { limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders for customer failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour filtrer les commandes
export const filterOrdersDispatch = (
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    let response;
    switch (selectedFilter) {
      case "date":
        response = await axios.get(`/api/orders/list/date/${selectedDate.format("YYYY-MM-DD")}`, {
          params: { limit, offset }
        });
        break;
      case "suppliers":
        response = await axios.get(`/api/orders/list/suppliers/`, {
          params: { supplierIds: selectedSupplierIds, limit, offset }
        });
        break;
      case "customers":
        response = await axios.get(`/api/orders/list/customers/`, {
          params: { customerIds: selectedCustomerIds, limit, offset }
        });
        break;
      default:
        response = await axios.get(`/api/orders/list/`, {
          params: { limit, offset }
        });
    }

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Filter orders failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour ajouter une commande
export const addOrder = (userId: number, menus: Object[], date: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderSuccess(false));
    dispatch(setOrderError(null));

    const response = await axios.post(`/api/orders/add/`, {
      userId,
      menus,
      date
    });

    if (response.data) {
      dispatch(setOrderSuccess(true));
      dispatch(setCartList([]));
      dispatch(getOrdersForCustomer());
    } else {
      dispatch(setOrderError("Add order failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour supprimer des commandes
export const deleteOrders = (
  id: number,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderSuccess(false));
    dispatch(setOrderError(null));

    const response = await axios.delete(`/api/orders/delete/${id}`);

    if (response.data) {
      dispatch(setOrderSuccess(true));
      if (!forCustomer) {
        dispatch(
          filterOrdersDispatch(
            limit,
            offset,
            selectedFilter,
            selectedDate,
            selectedSupplierIds,
            selectedCustomerIds
          )
        );
      } else {
        dispatch(getOrdersForCustomer(limit, offset));
      }
    } else {
      dispatch(setOrderError("Delete order failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour modifier une commande
export const editOrder = (
  orderId: number,
  menuId: number,
  quantity: number,
  remark: string,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderSuccess(false));
    dispatch(setOrderError(null));

    const response = await axios.put(`/api/orders/edit_menu/`, {
      orderId,
      menuId,
      quantity,
      remark
    });

    if (response.data) {
      dispatch(setOrderSuccess(true));
      if (!forCustomer) {
        dispatch(
          filterOrdersDispatch(
            limit,
            offset,
            selectedFilter,
            selectedDate,
            selectedSupplierIds,
            selectedCustomerIds
          )
        );
      } else {
        dispatch(getOrdersForCustomer(limit, offset));
      }
    } else {
      dispatch(setOrderError("Edit order failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour supprimer une commande
export const deleteOrder = (
  id: number,
  forCustomer: boolean = false,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string = "",
  selectedDate: moment.Moment = moment(),
  selectedSupplierIds: number[] = [],
  selectedCustomerIds: number[] = []
) => {
  return deleteOrders(
    id,
    forCustomer,
    limit,
    offset,
    selectedFilter,
    selectedDate,
    selectedSupplierIds,
    selectedCustomerIds
  );
};

// Action thunk pour récupérer toutes les commandes
export const getOrders = (limit: number = 0, offset: number = 0) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/`, {
      params: { limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour récupérer les commandes d'un fournisseur
export const getOrdersForSupplier = (
  supplierId: number,
  todayOnly: boolean = false,
  limit: number = 0,
  offset: number = 0
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/supplier/${supplierId}`, {
      params: { todayOnly, limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders for supplier failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour récupérer les extras des commandes
export const getOrdersExtra = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/extras/`);

    if (response.data.data) {
      dispatch(setOrderExtraList(response.data.data));
    } else {
      dispatch(setOrderError("Get orders extra failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour récupérer les commandes pour une date
export const getOrdersForDate = (date: string, limit: number = 0, offset: number = 0) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/date/${date}`, {
      params: { limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders for date failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour récupérer les commandes pour plusieurs fournisseurs
export const getOrdersForSuppliers = (supplierIds: number[], limit: number = 0, offset: number = 0) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/suppliers/`, {
      params: { supplierIds, limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders for suppliers failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour récupérer les commandes pour plusieurs clients
export const getOrdersForCustomers = (customerIds: number[], limit: number = 0, offset: number = 0) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/customers/`, {
      params: { customerIds, limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderList(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders for customers failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

// Action thunk pour récupérer les commandes d'un client avec spread
export const getOrdersForCustomerSpread = (limit: number = 0, offset: number = 0) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setOrderLoading(true));
    dispatch(setOrderError(null));

    const response = await axios.get(`/api/orders/list/customer/spread/`, {
      params: { limit, offset }
    });

    if (response.data.data) {
      dispatch(setOrderListSpread(response.data.data));
      dispatch(setOrderListTotalCount(response.data.total));
    } else {
      dispatch(setOrderError("Get orders for customer spread failed!"));
    }
  } catch (error) {
    dispatch(setOrderError(error instanceof Error ? error.message : "An error occurred"));
  } finally {
    dispatch(setOrderLoading(false));
  }
};

export default orderSlice.reducer;
