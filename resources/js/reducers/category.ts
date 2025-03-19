import { SET_CATEGORY_LIST, CategoryAction } from "../actions/category";
import ICategory from "../interfaces/ICategory";

const initialState = {
  categoryList: []
};

type State = {
  categoryList: ICategory[];
};

const category = (state: State = initialState, action: CategoryAction) => {
  switch (action.type) {
    case SET_CATEGORY_LIST:
      return Object.assign({}, state, {
        categoryList: action.payload.data
      });
    default:
      return state;
  }
};

export default category;
