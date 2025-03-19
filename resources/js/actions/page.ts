// types declaration

type SelectedAction = {
  type: 'SET_SELECTED',
  payload: number,
};

export type PageAction = SelectedAction;

// types definition

export const SET_SELECTED = 'SET_SELECTED';
export const setSelected = (selected: number) => ({
  type: SET_SELECTED,
  payload: selected,
});
