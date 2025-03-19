// types declaration

interface AddPendingAction {
  type: "SET_ADD_PENDING";
  payload: boolean;
}

interface AddSuccessAction {
  type: "SET_ADD_SUCCESS";
  payload: boolean;
}

interface AddErrorAction {
  type: "SET_ADD_ERROR";
  payload: string;
}

export type AddAction = AddPendingAction | AddSuccessAction | AddErrorAction;

// types definition

export const SET_ADD_PENDING = "SET_ADD_PENDING";
export const setAddPending = (isAddPending: boolean) => ({
  type: SET_ADD_PENDING,
  payload: isAddPending
});

export const SET_ADD_SUCCESS = "SET_ADD_SUCCESS";
export const setAddSuccess = (isAddSuccess: boolean) => ({
  type: SET_ADD_SUCCESS,
  payload: isAddSuccess
});

export const SET_ADD_ERROR = "SET_ADD_ERROR";
export const setAddError = (addError: string) => ({
  type: SET_ADD_ERROR,
  payload: addError
});
