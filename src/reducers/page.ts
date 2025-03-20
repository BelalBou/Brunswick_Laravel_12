import { SET_SELECTED, PageAction } from "../actions/page";

const initialState = {
  selected: 1
};

type State = {
  selected: number;
};

const page = (state: State = initialState, action: PageAction) => {
  switch (action.type) {
    case SET_SELECTED:
      return Object.assign({}, state, {
        selected: action.payload
      });
    default:
      return state;
  }
};

export default page;
