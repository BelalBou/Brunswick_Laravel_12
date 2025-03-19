import axios from "axios";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type ExtraListAction = {
  type: "SET_EXTRA_LIST";
  payload: any;
};

export type ExtraAction = ExtraListAction;

// types definition

export const SET_EXTRA_LIST = "SET_EXTRA_LIST";
export const setExtraList = (extraList: any) => ({
  type: SET_EXTRA_LIST,
  payload: extraList
});

// extra

function addExtraDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add extra failed!"));
    } else {
      dispatch(getExtrasSupplier(supplierId));
    }
  };
}

export const addExtra = (
  title: string,
  titleEn: string,
  pricing: number,
  supplierId: number,
  menuSizeId: number
) => (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/extras/add/`, {
      title,
      titleEn,
      pricing,
      supplierId,
      menuSizeId
    })
    .then(res => dispatch(addExtraDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function editExtraDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit extra failed!"));
    } else {
      dispatch(getExtrasSupplier(supplierId));
    }
  };
}

export const editExtra = (
  id: number,
  title: string,
  titleEn: string,
  pricing: number,
  supplierId: number,
  menuSizeId: number
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/extras/edit/${id}`, {
      title,
      titleEn,
      pricing,
      supplierId,
      menuSizeId
    })
    .then(res => dispatch(editExtraDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteExtraDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete extra failed!"));
    } else {
      dispatch(getExtrasSupplier(supplierId));
    }
  };
}

export const deleteExtra = (id: number, supplierId: number) => (
  dispatch: Function
) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/extras/delete/${id}`, {})
    .then(res => dispatch(deleteExtraDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getExtrasSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List extras supplier failed!"));
    }
  };
}

export const getExtrasSupplier = (supplierId: number) => (
  dispatch: Function
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const extraList = axios.get(`/api/extras/list_supplier/${supplierId}`, {});
  dispatch(setExtraList(extraList))
    .then((res: any) => dispatch(getExtrasSupplierDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
