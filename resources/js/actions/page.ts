import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageState {
  selected: number;
}

const initialState: PageState = {
  selected: 0
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
    resetPageState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const { setSelected, resetPageState } = pageSlice.actions;

export default pageSlice.reducer;
