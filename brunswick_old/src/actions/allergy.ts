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

type AllergyListAction = {
  type: "SET_ALLERGY_LIST";
  payload: any;
};

export type AllergyAction = AllergyListAction;

// types definition

export const SET_ALLERGY_LIST = "SET_ALLERGY_LIST";
export const setAllergyList = (allergyList: any) => ({
  type: SET_ALLERGY_LIST,
  payload: allergyList
});

// allergy

function addAllergyDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add allergy failed!"));
    } else {
      dispatch(getAllergies());
    }
  };
}

export const addAllergy = (description: string, descriptionEn: string) => (
  dispatch: Function
) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));
  axios
    .post(`/api/allergies/add/`, {
      description,
      descriptionEn
    })
    .then(res => dispatch(addAllergyDispatch(res)))
    .catch((err: string) => dispatch(setAddError(err)))
    .then(() => dispatch(setAddPending(false)));
};

function editAllergyDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit allergy failed!"));
    } else {
      dispatch(getAllergies());
    }
  };
}

export const editAllergy = (
  id: number,
  description: string,
  descriptionEn: string
) => (dispatch: Function) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));
  axios
    .put(`/api/allergies/edit/${id}`, {
      description,
      descriptionEn
    })
    .then(res => dispatch(editAllergyDispatch(res)))
    .catch((err: string) => dispatch(setEditError(err)))
    .then(() => dispatch(setEditPending(false)));
};

function deleteAllergyDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete allergy failed!"));
    } else {
      dispatch(getAllergies());
    }
  };
}

export const deleteAllergy = (id: number) => (dispatch: Function) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));
  axios
    .delete(`/api/allergies/delete/${id}`, {})
    .then(res => dispatch(deleteAllergyDispatch(res)))
    .catch((err: string) => dispatch(setDeleteError(err)))
    .then(() => dispatch(setDeletePending(false)));
};

function getAllergiesDispatch(res: any) {
  return (dispatch: Function) => {
    dispatch(setListSuccess(!!res.payload.data));
    if (!res.payload.data) {
      dispatch(setListError("List allergies failed!"));
    }
  };
}

export const getAllergies = () => (dispatch: Function) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));
  const allergyList = axios.get(`/api/allergies/list/`, {});
  dispatch(setAllergyList(allergyList))
    .then((res: any) => dispatch(getAllergiesDispatch(res)))
    .catch((err: string) => dispatch(setListError(err)))
    .then(() => dispatch(setListPending(false)));
};
