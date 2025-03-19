// types declaration

type EditPendingAction = {
  type: 'SET_EDIT_PENDING',
  payload: boolean,
};

type EditSuccessAction = {
  type: 'SET_EDIT_SUCCESS',
  payload: boolean,
};

type EditErrorAction = {
  type: 'SET_EDIT_ERROR',
  payload: string,
};

export type EditAction = EditPendingAction | EditSuccessAction | EditErrorAction;

// types definition

export const SET_EDIT_PENDING = 'SET_EDIT_PENDING';
export const setEditPending = (isEditPending: boolean) => ({
  type: SET_EDIT_PENDING,
  payload: isEditPending,
});

export const SET_EDIT_SUCCESS = 'SET_EDIT_SUCCESS';
export const setEditSuccess = (isEditSuccess: boolean) => ({
  type: SET_EDIT_SUCCESS,
  payload: isEditSuccess,
});

export const SET_EDIT_ERROR = 'SET_EDIT_ERROR';
export const setEditError = (editError: string) => ({
  type: SET_EDIT_ERROR,
  payload: editError,
});
