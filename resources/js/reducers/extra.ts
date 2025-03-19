import { SET_EXTRA_LIST, ExtraAction } from "../actions/extra";
import IExtra from "../interfaces/IExtra";

const initialState = {
  extraList: []
};

type State = {
  extraList: IExtra[];
};

const extra = (state: State = initialState, action: ExtraAction) => {
  switch (action.type) {
    case SET_EXTRA_LIST:
      return Object.assign({}, state, {
        extraList: action.payload.data
      });
    default:
      return state;
  }
};

export default extra;
