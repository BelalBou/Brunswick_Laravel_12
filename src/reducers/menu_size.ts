import { SET_MENU_SIZE_LIST, MenuSizeAction } from "../actions/menu_size";
import IMenuSize from "../interfaces/IMenuSize";

const initialState = {
  menuSizeList: []
};

type State = {
  menuSizeList: IMenuSize[];
};

const menuSize = (state: State = initialState, action: MenuSizeAction) => {
  switch (action.type) {
    case SET_MENU_SIZE_LIST:
      return Object.assign({}, state, {
        menuSizeList: action.payload.data
      });
    default:
      return state;
  }
};

export default menuSize;
