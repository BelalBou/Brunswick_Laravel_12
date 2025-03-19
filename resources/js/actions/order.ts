import axios from "axios";
import moment from "moment";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";
import { setCartList } from "./cart";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type OrderListAction = {
  type: "SET_ORDER_LIST";
  payload: any;
};

type OrderListSpreadAction = {
  type: "SET_ORDER_LIST_SPREAD";
  payload: any;
};

type OrderExtraListAction = {
  type: "SET_ORDER_EXTRA_LIST";
  payload: any;
};

type OrderListTotalCount = {
  type: "SET_ORDER_LIST_TOTAL_COUNT";
  payload: any;
};

export type OrderAction =
  | OrderListAction
  | OrderListSpreadAction
  | OrderExtraListAction
  | OrderListTotalCount;

// types definition

export const SET_ORDER_LIST = "SET_ORDER_LIST";
export const setOrderList = (orderList: any) => ({
  type: SET_ORDER_LIST,
  payload: orderList
});

export const SET_ORDER_LIST_SPREAD = "SET_ORDER_LIST_SPREAD";
export const setOrderListSpread = (orderList: any) => ({
  type: SET_ORDER_LIST_SPREAD,
  payload: orderList
});

export const SET_ORDER_EXTRA_LIST = "SET_ORDER_EXTRA_LIST";
export const setOrderExtraList = (orderExtraList: any) => ({
  type: SET_ORDER_EXTRA_LIST,
  payload: orderExtraList
});

export const SET_ORDER_LIST_TOTAL_COUNT = "SET_ORDER_LIST_TOTAL_COUNT";
export const setOrderListTotalCount = (orderListTotalCount: any) => ({
  type: SET_ORDER_LIST_TOTAL_COUNT,
  payload: orderListTotalCount
});

// order

function addOrderDispatch(res: any) {
  return (dispatch: Function) => {
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
  dispatch: Function
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
  return (dispatch: Function) => {
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
) => (dispatch: Function) => {
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
  return (dispatch: Function) => {
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
) => (dispatch: Function) => {
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
  return (dispatch: Function) => {
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
) => (dispatch: Function) => {
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
  return (dispatch: Function) => {
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
) => (dispatch: Function) => {
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

function getOrdersDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order failed!"));
    }
  };
}

export const getOrders = (
  todayOnly: boolean = false,
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list/`, {
    todayOnly,
    limit,
    offset
  });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderList(orderList))
    .then((res: any) => dispatch(getOrdersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForCustomerDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order for customer failed!"));
    }
  };
}

export const getOrdersForCustomer = (limit: number = 0, offset: number = 0) => (
  dispatch: Function
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_customer`, { limit, offset });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderList(orderList))
    .then((res: any) => dispatch(getOrdersForCustomerDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForCustomerSpreadDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order for customer spread failed!"));
    }
  };
}

export const getOrdersForCustomerSpread = (
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_customer`, {
    limit,
    offset
  });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderListSpread(orderList))
    .then((res: any) => dispatch(getOrdersForCustomerSpreadDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersTotalCountForCustomerDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order total count for customer failed!"));
    }
  };
}

export const getOrdersTotalCountForCustomer = (
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_customer`, { limit, offset });
  dispatch(setOrderListTotalCount(orderList))
    .then((res: any) => dispatch(getOrdersTotalCountForCustomerDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order failed!"));
    }
  };
}

export const getOrdersForSupplier = (
  supplierId: number,
  todayOnly: boolean = false,
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_supplier/${supplierId}`, {
    todayOnly,
    limit,
    offset
  });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderList(orderList))
    .then((res: any) => dispatch(getOrdersForSupplierDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForSuppliersDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List orders failed!"));
    }
  };
}

export const getOrdersForSuppliers = (
  supplierIds: Array<number>,
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_suppliers/`, {
    ids: supplierIds,
    limit,
    offset
  });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderList(orderList))
    .then((res: any) => dispatch(getOrdersForSuppliersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForCustomersDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order for customers failed!"));
    }
  };
}

export const getOrdersForCustomers = (
  customerIds: number[],
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_customers`, {
    ids: customerIds,
    limit,
    offset
  });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderList(orderList))
    .then((res: any) => dispatch(getOrdersForCustomersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersForDateDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List order for date failed!"));
    }
  };
}

export const getOrdersForDate = (
  date: string,
  limit: number = 0,
  offset: number = 0
) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderList = axios.post(`/api/orders/list_date`, {
    date,
    limit,
    offset
  });
  dispatch(setOrderListTotalCount(orderList));
  dispatch(setOrderList(orderList))
    .then((res: any) => dispatch(getOrdersForDateDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getOrdersExtraDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List orders extra failed!"));
    }
  };
}

export const getOrdersExtra = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const orderExtraList = axios.get(`/api/orders/list_extra/`);
  dispatch(setOrderExtraList(orderExtraList))
    .then((res: any) => dispatch(getOrdersExtraDispatch(res)))
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
  return (dispatch: Function) => {
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
