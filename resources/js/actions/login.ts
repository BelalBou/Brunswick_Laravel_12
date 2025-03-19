import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../types/redux';

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
    }
  }
});

export const { setLoginPending, setLoginSuccess, setLoginError } = loginSlice.actions;

// Action thunk pour la connexion
export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoginPending(true));
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion');
    }

    // Stockage des données utilisateur dans le localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    
    dispatch(setLoginSuccess(true));
    return data;
  } catch (error) {
    dispatch(setLoginError(error instanceof Error ? error.message : 'Une erreur est survenue'));
    throw error;
  } finally {
    dispatch(setLoginPending(false));
  }
};

// Action thunk pour la déconnexion
export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('user');
  dispatch(setLoginSuccess(false));
};

export default loginSlice.reducer;
