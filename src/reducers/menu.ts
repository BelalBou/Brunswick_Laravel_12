import { SET_MENU_LIST, MenuAction } from "../actions/menu";
import IMenu from "../interfaces/IMenu";

const initialState = {
  menuList: []
};

type State = {
  menuList: IMenu[];
};

const menu = (state: State = initialState, action: MenuAction) => {
  switch (action.type) {
    case SET_MENU_LIST:
      return Object.assign({}, state, {
        menuList: action.payload.data
      });
    default:
      return state;
  }
};

export default menu;
