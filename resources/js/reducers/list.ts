import {
  SET_LIST_PENDING,
  SET_LIST_SUCCESS,
  SET_LIST_ERROR,
  ListAction
} from "../actions/list";

const initialState = {
  isListPending: false,
  isListSuccess: false,
  listError: ""
};

type State = {
  isListPending: boolean;
  isListSuccess: boolean;
  listError: string;
};

const list = (state: State = initialState, action: ListAction) => {
  switch (action.type) {
    case SET_LIST_PENDING:
      return Object.assign({}, state, {
        isListPending: action.payload
      });
    case SET_LIST_SUCCESS:
      return Object.assign({}, state, {
        isListSuccess: action.payload
      });
    case SET_LIST_ERROR:
      return Object.assign({}, state, {
        listError: action.payload
      });
    default:
      return state;
  }
};

export default list;
