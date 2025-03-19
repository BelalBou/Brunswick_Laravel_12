// types declaration

type ListPendingAction = {
  type: 'SET_LIST_PENDING',
  payload: boolean,
};

type ListSuccessAction = {
  type: 'SET_LIST_SUCCESS',
  payload: boolean,
};

type ListErrorAction = {
  type: 'SET_LIST_ERROR',
  payload: string,
};

export type ListAction = ListPendingAction | ListSuccessAction | ListErrorAction;

// types definition

export const SET_LIST_PENDING = 'SET_LIST_PENDING';
export const setListPending = (isListPending: boolean) => ({
  type: SET_LIST_PENDING,
  payload: isListPending,
});

export const SET_LIST_SUCCESS = 'SET_LIST_SUCCESS';
export const setListSuccess = (isListSuccess: boolean) => ({
  type: SET_LIST_SUCCESS,
  payload: isListSuccess,
});

export const SET_LIST_ERROR = 'SET_LIST_ERROR';
export const setListError = (listError: string) => ({
  type: SET_LIST_ERROR,
  payload: listError,
});
