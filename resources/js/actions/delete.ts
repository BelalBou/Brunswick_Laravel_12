import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeleteState {
  isPending: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: DeleteState = {
  isPending: false,
  isSuccess: false,
  error: null
};

const deleteSlice = createSlice({
  name: 'delete',
  initialState,
  reducers: {
    setDeletePending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
    setDeleteSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    setDeleteError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetDeleteState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setDeletePending,
  setDeleteSuccess,
  setDeleteError,
  resetDeleteState
} = deleteSlice.actions;

export default deleteSlice.reducer;
