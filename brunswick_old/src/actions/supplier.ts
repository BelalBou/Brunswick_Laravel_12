import axios from "axios";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";
import moment from "moment";

// types declaration

type SupplierListAction = {
  type: "SET_SUPPLIER_LIST";
  payload: any;
};

export type SupplierAction = SupplierListAction;

// types definition

export const SET_SUPPLIER_LIST = "SET_SUPPLIER_LIST";
export const setSupplierList = (supplierList: any) => ({
  type: SET_SUPPLIER_LIST,
  payload: supplierList
});

// supplier

function addSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add supplier failed!"));
    } else {
      dispatch(getSuppliers());
    }
  };
}

export const addSupplier = (
  name: string,
  emailAddress: string,
  emailAddress2: string,
  emailAddress3: string,
  forVendorOnly: boolean
) => (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/suppliers/add/`, {
      name,
      emailAddress,
      emailAddress2,
      emailAddress3,
      forVendorOnly
    })
    .then(res => dispatch(addSupplierDispatch(res)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function editSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit supplier failed!"));
    } else {
      dispatch(getSuppliers());
    }
  };
}

export const editSupplier = (
  id: number,
  name: string,
  emailAddress: string,
  emailAddress2: string,
  emailAddress3: string,
  forVendorOnly: boolean,
  awayStart: moment.Moment,
  awayEnd: moment.Moment,
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/suppliers/edit/${id}`, {
      name,
      emailAddress,
      emailAddress2,
      emailAddress3,
      forVendorOnly,
      awayStart,
      awayEnd
    })
    .then(res => dispatch(editSupplierDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete supplier failed!"));
    } else {
      dispatch(getSuppliers());
    }
  };
}

export const deleteSupplier = (id: number) => (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/suppliers/delete/${id}`, {})
    .then(res => dispatch(deleteSupplierDispatch(res)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getSuppliersDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List suppliers failed!"));
    }
  };
}

export const getSuppliers = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const supplierList = axios.get(`/api/suppliers/list/`, {});
  dispatch(setSupplierList(supplierList))
    .then((res: any) => dispatch(getSuppliersDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
export const getSuppliersAdmin = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const supplierList = axios.get(`/api/suppliers/list/?admin=1`, {});
  dispatch(setSupplierList(supplierList))
      .then((res: any) => dispatch(getSuppliersDispatch(res)))
      .catch((err: string) => dispatch(setListError(err)))
      .then(() => dispatch(setListPending(false)));
};