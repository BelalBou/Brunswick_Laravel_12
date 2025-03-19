import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../types/redux.d";


interface LoginState {
  isLoginPending: boolean;
  isLoginSuccess: boolean;
  loginError: string;
}

const initialState: LoginState = {
  isLoginPending: false,
  isLoginSuccess: false,
  loginError: ''
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginPending: (state, action: PayloadAction<boolean>) => {
      state.isLoginPending = action.payload;
    },
    setLoginSuccess: (state, action: PayloadAction<boolean>) => {
      state.isLoginSuccess = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string>) => {
      state.loginError = action.payload;
    },
    resetLoginState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const { setLoginPending, setLoginSuccess, setLoginError, resetLoginState } = loginSlice.actions;

// Action thunk pour la connexion
export const login = createAsyncThunk(
  'login/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(setLoginPending(true));
      dispatch(setLoginError(''));

      const response = await axios.post('/api/auth/login', credentials);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(setLoginSuccess(true));
        return response.data;
      } else {
        dispatch(setLoginError('Login failed'));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      dispatch(setLoginError(errorMessage));
      return null;
    } finally {
      dispatch(setLoginPending(false));
    }
  }
);

// Action thunk pour la déconnexion
export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('user');
  dispatch(setLoginSuccess(false));
};

export default loginSlice.reducer;
