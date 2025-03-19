import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AddState {
  isPending: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: AddState = {
  isPending: false,
  isSuccess: false,
  error: null
};

const addSlice = createSlice({
  name: 'add',
  initialState,
  reducers: {
    setAddPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
    setAddSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    setAddError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAddState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setAddPending,
  setAddSuccess,
  setAddError,
  resetAddState
} = addSlice.actions;

export default addSlice.reducer;
