import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";
import { setCartList } from "./cart";
import { AppDispatch } from "../types/redux";
import IOrder from "../interfaces/IOrder";
import IOrderExtra from "../interfaces/IOrderExtra";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type OrderListAction = {
  type: "SET_ORDER_LIST";
  payload: IOrder[];
};

type OrderListSpreadAction = {
  type: "SET_ORDER_LIST_SPREAD";
  payload: IOrder[];
};

type OrderExtraListAction = {
  type: "SET_ORDER_EXTRA_LIST";
  payload: IOrderExtra[];
};

type OrderListTotalCount = {
  type: "SET_ORDER_LIST_TOTAL_COUNT";
  payload: number;
};

export type OrderAction =
  | OrderListAction
  | OrderListSpreadAction
  | OrderExtraListAction
  | OrderListTotalCount;

// types definition

export const SET_ORDER_LIST = "SET_ORDER_LIST";
export const setOrderList = (orderList: IOrder[]) => ({
  type: SET_ORDER_LIST,
  payload: orderList
});

export const SET_ORDER_LIST_SPREAD = "SET_ORDER_LIST_SPREAD";
export const setOrderListSpread = (orderList: IOrder[]) => ({
  type: SET_ORDER_LIST_SPREAD,
  payload: orderList
});

export const SET_ORDER_EXTRA_LIST = "SET_ORDER_EXTRA_LIST";
export const setOrderExtraList = (orderExtraList: IOrderExtra[]) => ({
  type: SET_ORDER_EXTRA_LIST,
  payload: orderExtraList
});

export const SET_ORDER_LIST_TOTAL_COUNT = "SET_ORDER_LIST_TOTAL_COUNT";
export const setOrderListTotalCount = (orderListTotalCount: number) => ({
  type: SET_ORDER_LIST_TOTAL_COUNT,
  payload: orderListTotalCount
});

// order

function addOrderDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add order failed!"));
    } else {
      dispatch(setCartList([]));
      dispatch(getOrdersForCustomer());
    }
  };
}

export const addOrder = (userId: number, menus: Object[], date: string) => (
  dispatch: AppDispatch
) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/orders/add/`, {
      userId,
      menus,
      date
    })
    .then(res => dispatch(addOrderDispatch(res)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function deleteOrdersDispatch(
  res: any,
  forCustomer: boolean,
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete order failed!"));
    } else {
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
    }
  };
}

export const deleteOrders = (
  id: number,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => (dispatch: AppDispatch) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/orders/delete/${id}`, {})
    .then(res =>
      dispatch(
        deleteOrdersDispatch(
          res,
          forCustomer,
          limit,
          offset,
          selectedFilter,
          selectedDate,
          selectedSupplierIds,
          selectedCustomerIds
        )
      )
    )
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function editOrderDispatch(
  res: any,
  forCustomer: boolean,
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit order failed!"));
    } else {
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
    }
  };
}

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
) => (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/orders/edit_menu/`, {
      orderId,
      menuId,
      quantity,
      remark
    })
    .then(res =>
      dispatch(
        editOrderDispatch(
          res,
          forCustomer,
          limit,
          offset,
          selectedFilter,
          selectedDate,
          selectedSupplierIds,
          selectedCustomerIds
        )
      )
    )
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function editArticleCarriedAwayDispatch(res: any, selectedDate: string) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit article carried away failed!"));
    } else {
      dispatch(getOrdersForDate(selectedDate));
    }
  };
}

export const editArticleCarriedAway = (
  orderId: number,
  menuId: number,
  checked: boolean,
  selectedDate: string
) => (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/orders/edit_article_carried_away/`, {
      orderId,
      menuId,
      checked
    })
    .then(res => dispatch(editArticleCarriedAwayDispatch(res, selectedDate)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteOrderDispatch(
  res: any,
  forCustomer: boolean,
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete menu from order failed!"));
    } else {
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
    }
  };
}

export const deleteOrder = (
  orderId: number,
  menuId: number,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => (dispatch: AppDispatch) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .put(`/api/orders/delete_menu/`, {
      orderId,
      menuId
    })
    .then(res =>
      dispatch(
        deleteOrderDispatch(
          res,
          forCustomer,
          limit,
          offset,
          selectedFilter,
          selectedDate,
          selectedSupplierIds,
          selectedCustomerIds
        )
      )
    )
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getOrdersDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders failed!"));
    } else {
      dispatch(setOrderList(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrders = (
  forCustomer: boolean = false,
  limit: number = 0,
  offset: number = 0
) => (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/`, {
      params: {
        forCustomer,
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForCustomerDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders for customer failed!"));
    } else {
      dispatch(setOrderList(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersForCustomer = (limit: number = 0, offset: number = 0) => (
  dispatch: AppDispatch
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/customer/`, {
      params: {
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersForCustomerDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForCustomerSpreadDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders for customer spread failed!"));
    } else {
      dispatch(setOrderListSpread(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersForCustomerSpread = (limit: number = 0, offset: number = 0) => (
  dispatch: AppDispatch
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/customer/spread/`, {
      params: {
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersForCustomerSpreadDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersTotalCountForCustomerDispatch(res: AxiosResponse<{ total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.total));
    if (!res.data.total) {
      dispatch(setListError("Get orders total count for customer failed!"));
    } else {
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersTotalCountForCustomer = (limit: number = 0, offset: number = 0) => (
  dispatch: AppDispatch
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/customer/total/`, {
      params: {
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersTotalCountForCustomerDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForSupplierDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders for supplier failed!"));
    } else {
      dispatch(setOrderList(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersForSupplier = (
  supplierId: number,
  todayOnly: boolean = false,
  limit: number = 0,
  offset: number = 0
) => (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/supplier/${supplierId}`, {
      params: {
        todayOnly,
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersForSupplierDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForSuppliersDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders for suppliers failed!"));
    } else {
      dispatch(setOrderList(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersForSuppliers = (supplierIds: number[], limit: number = 0, offset: number = 0) => (
  dispatch: AppDispatch
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/suppliers/`, {
      params: {
        supplierIds,
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersForSuppliersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForCustomersDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders for customers failed!"));
    } else {
      dispatch(setOrderList(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersForCustomers = (customerIds: number[], limit: number = 0, offset: number = 0) => (
  dispatch: AppDispatch
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/customers/`, {
      params: {
        customerIds,
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersForCustomersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForDateDispatch(res: AxiosResponse<{ data: IOrder[]; total: number }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders for date failed!"));
    } else {
      dispatch(setOrderList(res.data.data));
      dispatch(setOrderListTotalCount(res.data.total));
    }
  };
}

export const getOrdersForDate = (date: string, limit: number = 0, offset: number = 0) => (
  dispatch: AppDispatch
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/date/${date}`, {
      params: {
        limit,
        offset
      }
    })
    .then(res => dispatch(getOrdersForDateDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersExtraDispatch(res: AxiosResponse<{ data: IOrderExtra[] }>) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.data.data));
    if (!res.data.data) {
      dispatch(setListError("Get orders extra failed!"));
    } else {
      dispatch(setOrderExtraList(res.data.data));
    }
  };
}

export const getOrdersExtra = () => (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios
    .get(`/api/orders/list/extra/`)
    .then(res => dispatch(getOrdersExtraDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function filterOrdersDispatch(
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    switch (selectedFilter) {
      case "date":
        dispatch(
          getOrdersForDate(
            selectedDate ? selectedDate.format("YYYY-MM-DD") : selectedDate,
            limit,
            offset
          )
        );
        break;
      case "suppliers":
        dispatch(getOrdersForSuppliers(selectedSupplierIds, limit, offset));
        break;
      case "customers":
        dispatch(getOrdersForCustomers(selectedCustomerIds, limit, offset));
        break;
      default:
        dispatch(getOrders(false, limit, offset));
        break;
    }
  };
}
