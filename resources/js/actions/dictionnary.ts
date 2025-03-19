import axios from "axios";
import { setListPending, setListSuccess, setListError } from "./list";

// authentication

const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

// types declaration

type DictionnaryListAction = {
  type: "SET_DICTIONNARY_LIST";
  payload: any;
};

export type DictionnaryAction = DictionnaryListAction;

// types definition

export const SET_DICTIONNARY_LIST = "SET_DICTIONNARY_LIST";
export const setDictionnaryList = (dictionnaryList: any) => ({
  type: SET_DICTIONNARY_LIST,
  payload: dictionnaryList
});

// dictionnary

function getDictionnariesDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List dictionnaries failed!"));
    }
  };
}

export const getDictionnaries = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const dictionnaryList = axios.get(`/api/dictionnaries/list/`, {});
  dispatch(setDictionnaryList(dictionnaryList))
    .then((res: any) => dispatch(getDictionnariesDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
