import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditState {
  isPending: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: EditState = {
  isPending: false,
  isSuccess: false,
  error: null
};

const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    setEditPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
    setEditSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    setEditError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetEditState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setEditPending,
  setEditSuccess,
  setEditError,
  resetEditState
} = editSlice.actions;

export default editSlice.reducer;
