import axios from "axios";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";
import { setListPending, setListSuccess, setListError } from "./list";

// types declaration

type MenuSizeListAction = {
  type: "SET_MENU_SIZE_LIST";
  payload: any;
};

export type MenuSizeAction = MenuSizeListAction;

// types definition

export const SET_MENU_SIZE_LIST = "SET_MENU_SIZE_LIST";
export const setMenuSizeList = (menuSizeList: any) => ({
  type: SET_MENU_SIZE_LIST,
  payload: menuSizeList
});

// menuSize

function addMenuSizeDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add menu size failed!"));
    } else {
      dispatch(getMenuSizes());
    }
  };
}

export const addMenuSize = (title: string, titleEn: string) => (
  dispatch: Function
) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/menu_sizes/add/`, {
      title,
      titleEn
    })
    .then(res => dispatch(addMenuSizeDispatch(res)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function editMenuSizeDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit menu size failed!"));
    } else {
      dispatch(getMenuSizes());
    }
  };
}

export const editMenuSize = (id: number, title: string, titleEn: string) => (
  dispatch: Function
) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/menu_sizes/edit/${id}`, {
      name,
      title,
      titleEn
    })
    .then(res => dispatch(editMenuSizeDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteMenuSizeDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete menu size failed!"));
    } else {
      dispatch(getMenuSizes());
    }
  };
}

export const deleteMenuSize = (id: number) => (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/menu_sizes/delete/${id}`, {})
    .then(res => dispatch(deleteMenuSizeDispatch(res)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getMenuSizesDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List menu sizes failed!"));
    }
  };
}

export const getMenuSizes = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const menuSizeList = axios.get(`/api/menu_sizes/list/`, {});
  dispatch(setMenuSizeList(menuSizeList))
    .then((res: any) => dispatch(getMenuSizesDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
