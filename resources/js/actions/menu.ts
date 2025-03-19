import axios from "axios";
import async from "async";
import { setListPending, setListSuccess, setListError } from "./list";
import { setAddPending, setAddSuccess, setAddError } from "./add";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "./delete";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type MenuListAction = {
  type: "SET_MENU_LIST";
  payload: any;
};

export type MenuAction = MenuListAction;

// types definition

export const SET_MENU_LIST = "SET_MENU_LIST";
export const setMenuList = (menuList: any) => ({
  type: SET_MENU_LIST,
  payload: menuList
});

// menu

function addMenuDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add menu failed!"));
    } else {
      dispatch(getMenusSupplier(supplierId));
    }
  };
}

export const addMenu = (
  title: string,
  titleEn: string,
  sizeId: number,
  pricing: number,
  description: string,
  descriptionEn: string,
  categoryId: number,
  allergyIds: number[],
  extraIds: number[],
  picture: File,
  addPicture: boolean,
  supplierId: number
) => (dispatch: Function) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  async.waterfall(
    [
      (callback: any) => {
        axios
          .post(`/api/menus/add/`, {
            title,
            titleEn,
            sizeId,
            pricing,
            description,
            descriptionEn,
            categoryId,
            allergyIds,
            extraIds,
            supplierId,
            picture: picture && addPicture ? picture.name : null
          })
          .then(res => callback(null, res));
      },
      (result: any, callback: any) => {
        if (result && picture && addPicture) {
          const data = new FormData();
          data.append("picture", picture);
          axios.post("/api/menus/add_picture/", data);
        }
        callback(null, result);
      },
      (result: any, callback: any) => {
        dispatch(addMenuDispatch(result, supplierId));
        callback(null, "");
      }
    ],
    err => {
      if (err) dispatch(setAddError(err.message));
      dispatch(setAddPending(false));
    }
  );
};

function editMenuDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit menu failed!"));
    } else {
      dispatch(getMenusSupplier(supplierId));
    }
  };
}

export const editMenu = (
  id: number,
  title: string,
  titleEn: string,
  sizeId: number,
  pricing: number,
  description: string,
  descriptionEn: string,
  categoryId: number,
  allergyIds: number[],
  extraIds: number[],
  picture: File,
  editPicture: boolean,
  supplierId: number
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  async.waterfall(
    [
      (callback: any) => {
        axios
          .put(`/api/menus/edit/${id}`, {
            title,
            titleEn,
            sizeId,
            pricing,
            description,
            descriptionEn,
            categoryId,
            allergyIds,
            extraIds,
            supplierId,
            picture: picture && editPicture ? picture.name : null
          })
          .then(res => callback(null, res));
      },
      (result: any, callback: any) => {
        if (result && picture && editPicture) {
          const data = new FormData();
          data.append("picture", picture);
          axios.post("/api/menus/add_picture/", data);
        }
        callback(null, result);
      },
      (result: any, callback: any) => {
        dispatch(editMenuDispatch(result, supplierId));
        callback(null, "");
      }
    ],
    err => {
      if (err) dispatch(setEditError(err.message));
      dispatch(setEditPending(false));
    }
  );
};

function deleteMenuDispatch(res: any, supplierId: number) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete menu failed!"));
    } else {
      dispatch(getMenusSupplier(supplierId));
    }
  };
}

export const deleteMenu = (id: number, supplierId: number) => (
  dispatch: Function
) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/menus/delete/${id}`, {})
    .then(res => dispatch(deleteMenuDispatch(res, supplierId)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getMenusSupplierDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List menus for supplier failed!"));
    }
  };
}

export const getMenusSupplier = (id: number) => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  axios.get(`/api/menus/list_supplier/${id}`, {})
    .then(res => {
      dispatch(setMenuList(res.data));
      dispatch(getMenusSupplierDispatch(res));
    })
    .catch((err: string) => dispatch(setListError(err)))
    .finally(() => dispatch(setListPending(false)));
};

function getMenusDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List menus failed!"));
    }
  };
}

export const getMenus = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const menuList = axios.get("/api/menus/list/", {});
  dispatch(setMenuList(menuList))
    .then((res: any) => dispatch(getMenusDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
