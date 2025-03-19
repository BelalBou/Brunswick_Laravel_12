import { Dispatch } from "redux";

export interface PageState {
  selected: number;
}

export interface SelectedAction {
  type: "SET_SELECTED";
  payload: number;
}

export type PageAction = SelectedAction;

export const setSelected = (selected: number): SelectedAction => ({
  type: "SET_SELECTED",
  payload: selected
});

export const pageDispatch = (pageData: PageState) => (dispatch: Dispatch<PageAction>) => {
  dispatch(setSelected(pageData.selected));
};
