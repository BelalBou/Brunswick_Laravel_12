import axios from "axios";
import { setListPending, setListSuccess, setListError } from "./list";

// types declaration

type DailyMailListAction = {
  type: "SET_DAILY_MAIL_LIST";
  payload: any;
};

export type DailyMailAction = DailyMailListAction;

// types definition

export const SET_DAILY_MAIL_LIST = "SET_DAILY_MAIL_LIST";
export const setDailyMailList = (dailyMailList: any) => ({
  type: SET_DAILY_MAIL_LIST,
  payload: dailyMailList
});

// dailyMail

function getDailyMailsDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List daily mails failed!"));
    }
  };
}

export const getDailyMails = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const dailyMailList = axios.get(`/api/daily_mails/list/`, {});
  dispatch(setDailyMailList(dailyMailList))
    .then((res: any) => dispatch(getDailyMailsDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
