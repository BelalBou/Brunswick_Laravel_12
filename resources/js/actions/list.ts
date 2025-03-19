import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ListState {
  isPending: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: ListState = {
  isPending: false,
  isSuccess: false,
  error: null
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setListPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
    setListSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    setListError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetListState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setListPending,
  setListSuccess,
  setListError,
  resetListState
} = listSlice.actions;

export default listSlice.reducer;
