import {
  SET_DELETE_PENDING,
  SET_DELETE_SUCCESS,
  SET_DELETE_ERROR,
  DeleteAction
} from "../actions/delete";

const initialState = {
  isDeletePending: false,
  isDeleteSuccess: false,
  deleteError: ""
};

type State = {
  isDeletePending: boolean;
  isDeleteSuccess: boolean;
  deleteError: string;
};

const _delete = (state: State = initialState, action: DeleteAction) => {
  switch (action.type) {
    case SET_DELETE_PENDING:
      return Object.assign({}, state, {
        isDeletePending: action.payload
      });
    case SET_DELETE_SUCCESS:
      return Object.assign({}, state, {
        isDeleteSuccess: action.payload
      });
    case SET_DELETE_ERROR:
      return Object.assign({}, state, {
        deleteError: action.payload
      });
    default:
      return state;
  }
};

export default _delete;
