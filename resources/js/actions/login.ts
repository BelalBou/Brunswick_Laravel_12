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

      // Adapter le format des données à celui attendu par l'API Laravel
      const payload = {
        emailAddress: credentials.email,
        password: credentials.password
      };

      // Utiliser la route Laravel correcte pour l'authentification
      const response = await axios.post('/api/login', payload);
      
      if (response.data) {
        // Formater les données utilisateur pour le localStorage
        const userData = {
          id: response.data.user.id,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          emailAddress: response.data.user.email_address,
          language: response.data.user.language,
          type: response.data.user.type,
          token: response.data.token,
          supplierId: response.data.user.supplier_id || 0
        };

        localStorage.setItem('user', JSON.stringify(userData));
        
        // Configurer le token pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        dispatch(setLoginSuccess(true));
        return userData;
      } else {
        dispatch(setLoginError('Échec de connexion'));
        return null;
      }
    } catch (error: any) {
      // Gérer les erreurs d'authentification
      let errorMessage = 'Une erreur est survenue lors de la connexion';
      
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        if (error.response.status === 400 || error.response.status === 401) {
          errorMessage = "Identifiants incorrects";
        } else if (error.response.status === 422) {
          errorMessage = "Veuillez remplir tous les champs correctement";
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setLoginError(errorMessage));
      return null;
    } finally {
      dispatch(setLoginPending(false));
    }
  }
);

// Action thunk pour la déconnexion
export const logout = () => async (dispatch: AppDispatch) => {
  try {
    // Appeler l'API pour révoquer le token si l'utilisateur est connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      await axios.post('/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error);
  } finally {
    // Toujours nettoyer le localStorage et l'état Redux même en cas d'erreur
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    dispatch(setLoginSuccess(false));
  }
};

export default loginSlice.reducer;
