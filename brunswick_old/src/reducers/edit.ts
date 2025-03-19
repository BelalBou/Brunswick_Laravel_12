import {
  SET_EDIT_PENDING,
  SET_EDIT_SUCCESS,
  SET_EDIT_ERROR,
  EditAction
} from "../actions/edit";

const initialState = {
  isEditPending: false,
  isEditSuccess: false,
  editError: ""
};

type State = {
  isEditPending: boolean;
  isEditSuccess: boolean;
  editError: string;
};

const edit = (state: State = initialState, action: EditAction) => {
  switch (action.type) {
    case SET_EDIT_PENDING:
      return Object.assign({}, state, {
        isEditPending: action.payload
      });
    case SET_EDIT_SUCCESS:
      return Object.assign({}, state, {
        isEditSuccess: action.payload
      });
    case SET_EDIT_ERROR:
      return Object.assign({}, state, {
        editError: action.payload
      });
    default:
      return state;
  }
};

export default edit;
