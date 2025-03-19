import {
  SET_ADD_PENDING,
  SET_ADD_SUCCESS,
  SET_ADD_ERROR,
  AddAction
} from "../actions/add";

const initialState = {
  isAddPending: false,
  isAddSuccess: false,
  addError: ""
};

type State = {
  isAddPending: boolean;
  isAddSuccess: boolean;
  addError: string;
};

const add = (state: State = initialState, action: AddAction) => {
  switch (action.type) {
    case SET_ADD_PENDING:
      return Object.assign({}, state, {
        isAddPending: action.payload
      });
    case SET_ADD_SUCCESS:
      return Object.assign({}, state, {
        isAddSuccess: action.payload
      });
    case SET_ADD_ERROR:
      return Object.assign({}, state, {
        addError: action.payload
      });
    default:
      return state;
  }
};

export default add;
