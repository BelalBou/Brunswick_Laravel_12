import axios from "axios";
import { setListPending, setListSuccess, setListError } from "./list";

// types declaration

type ServerTimeListAction = {
  type: "SET_SERVER_TIME_LIST";
  payload: any;
};

export type ServerTimeAction = ServerTimeListAction;

// types definition

export const SET_SERVER_TIME_LIST = "SET_SERVER_TIME_LIST";
export const setServerTime = (serverTimeList: any) => ({
  type: SET_SERVER_TIME_LIST,
  payload: serverTimeList
});

function getServerTimeDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("Get server time failed!"));
    }
  };
}

export const getServerTime = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const serverTime = axios.get(`/api/orders/check_time/`, {});
  dispatch(setServerTime(serverTime))
    .then((res: any) => dispatch(getServerTimeDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};