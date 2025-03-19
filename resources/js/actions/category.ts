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

type CategoryListAction = {
  type: "SET_CATEGORY_LIST";
  payload: any;
};

export type CategoryAction = CategoryListAction;

// types definition

export const SET_CATEGORY_LIST = "SET_CATEGORY_LIST";
export const setCategoryList = (categoryList: any) => ({
  type: SET_CATEGORY_LIST,
  payload: categoryList
});

// category

function addCategoryDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add category failed!"));
    } else {
      dispatch(getCategoriesSupplier(supplierId));
    }
  };
}

export const addCategory = (
  title: string,
  titleEn: string,
  order: number,
  supplierId: number
) => (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/categories/add/`, {
      title,
      titleEn,
      order,
      supplierId
    })
    .then(res => dispatch(addCategoryDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function editCategoryDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit category failed!"));
    } else {
      dispatch(getCategoriesSupplier(supplierId));
    }
  };
}

export const editCategory = (
  id: number,
  title: string,
  titleEn: string,
  order: number,
  supplierId: number
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/categories/edit/${id}`, {
      title,
      titleEn,
      order,
      supplierId
    })
    .then(res => dispatch(editCategoryDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteCategoryDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete category failed!"));
    } else {
      dispatch(getCategoriesSupplier(supplierId));
    }
  };
}

export const deleteCategory = (id: number, supplierId: number) => (
  dispatch: Function
) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/categories/delete/${id}`, {})
    .then(res => dispatch(deleteCategoryDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getCategoriesDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List categories failed!"));
    }
  };
}

export const getCategories = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const categoryList = axios.get(`/api/categories/list/`, {});
  dispatch(setCategoryList(categoryList))
    .then((res: any) => dispatch(getCategoriesDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};

function getCategoriesSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List categories supplier failed!"));
    }
  };
}

export const getCategoriesSupplier = (supplierId: number) => (
  dispatch: Function
) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const categoryList = axios.get(
    `/api/categories/list_supplier/${supplierId}`,
    {}
  );
  dispatch(setCategoryList(categoryList))
    .then((res: any) => dispatch(getCategoriesSupplierDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
