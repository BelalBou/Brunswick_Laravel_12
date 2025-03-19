import axios from "axios";
import { setEditPending, setEditSuccess, setEditError } from "./edit";
import { setListPending, setListSuccess, setListError } from "./list";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type SettingListAction = {
  type: "SET_SETTING_LIST";
  payload: any;
};

export type SettingAction = SettingListAction;

// types definition

export const SET_SETTING_LIST = "SET_SETTING_LIST";
export const setSettingList = (settingList: any) => ({
  type: SET_SETTING_LIST,
  payload: settingList
});

// setting

function editSettingDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit setting failed!"));
    } else {
      dispatch(getSettings());
    }
  };
}

export const editSetting = (
  id: number,
  timeLimit: string,
  startPeriod: string,
  endPeriod: string,
  emailOrderCc: string,
  emailSupplierCc: string,
  emailVendorCc: string
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/settings/edit/${id}`, {
      timeLimit,
      startPeriod,
      endPeriod,
      emailOrderCc,
      emailSupplierCc,
      emailVendorCc
    })
    .then(res => dispatch(editSettingDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function getSettingsDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List settings failed!"));
    }
  };
}

export const getSettings = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const settingList = axios.get(`/api/settings/list/`, {});
  dispatch(setSettingList(settingList))
    .then((res: any) => dispatch(getSettingsDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
