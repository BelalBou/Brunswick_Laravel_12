// types declaration

type DeletePendingAction = {
  type: 'SET_DELETE_PENDING',
  payload: boolean,
};

type DeleteSuccessAction = {
  type: 'SET_DELETE_SUCCESS',
  payload: boolean,
};

type DeleteErrorAction = {
  type: 'SET_DELETE_ERROR',
  payload: string,
};

export type DeleteAction =
  | DeletePendingAction
  | DeleteSuccessAction
  | DeleteErrorAction;

// types definition

export const SET_DELETE_PENDING = 'SET_DELETE_PENDING';
export const setDeletePending = (isDeletePending: boolean) => ({
  type: SET_DELETE_PENDING,
  payload: isDeletePending,
});

export const SET_DELETE_SUCCESS = 'SET_DELETE_SUCCESS';
export const setDeleteSuccess = (isDeleteSuccess: boolean) => ({
  type: SET_DELETE_SUCCESS,
  payload: isDeleteSuccess,
});

export const SET_DELETE_ERROR = 'SET_DELETE_ERROR';
export const setDeleteError = (deleteError: string) => ({
  type: SET_DELETE_ERROR,
  payload: deleteError,
});
