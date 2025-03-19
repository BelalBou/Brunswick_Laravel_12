import {
  SET_DICTIONNARY_LIST,
  DictionnaryAction
} from "../actions/dictionnary";
import IDictionnary from "../interfaces/IDictionnary";

const initialState = {
  dictionnaryList: []
};

type State = {
  dictionnaryList: IDictionnary[];
};

const dictionnary = (
  state: State = initialState,
  action: DictionnaryAction
) => {
  switch (action.type) {
    case SET_DICTIONNARY_LIST:
      return Object.assign({}, state, {
        dictionnaryList: action.payload.data
      });
    default:
      return state;
  }
};

export default dictionnary;
