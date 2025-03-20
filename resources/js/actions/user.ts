import axios from "axios";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import IUser from "../interfaces/IUser";
import { AppDispatch } from "../types/redux.d";

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface UserState {
  currentUser: IUser | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  success: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUserSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    resetUserState: (state) => {
      Object.assign(state, initialState);
    },
    setUserId: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.id = action.payload;
      }
    },
    setUserFirstName: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.first_name = action.payload;
      }
    },
    setUserLastName: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.last_name = action.payload;
      }
    },
    setUserLanguage: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.language = action.payload;
      }
    },
    setUserType: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.type = action.payload;
      }
    },
    setUserSupplierId: (state, action: PayloadAction<number | null>) => {
      if (state.currentUser) {
        state.currentUser.supplier_id = action.payload;
      }
    },
    setUserEmailAddress: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.email_address = action.payload;
      }
    },
    setUserPassword: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.password = action.payload;
      }
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.token = action.payload;
      }
    }
  }
});

export const {
  setCurrentUser,
  setUserLoading,
  setUserError,
  setUserSuccess,
  resetUserState,
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken
} = userSlice.actions;

// Action thunk pour récupérer l'utilisateur courant
export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));

      const response = await axios.get('/api/user/current');
      
      if (response.data) {
        dispatch(setCurrentUser(response.data));
        dispatch(setUserSuccess(true));
        return response.data;
      } else {
        dispatch(setUserError('Failed to get current user'));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while getting current user';
      dispatch(setUserError(errorMessage));
      return null;
    } finally {
      dispatch(setUserLoading(false));
    }
  }
);

// Action thunk pour mettre à jour l'utilisateur
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<IUser>, { dispatch }) => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));
      dispatch(setUserSuccess(false));

      const response = await axios.put('/api/user/update', userData);
      
      if (response.data) {
        dispatch(setCurrentUser(response.data));
        dispatch(setUserSuccess(true));
        return response.data;
      } else {
        dispatch(setUserError('Failed to update user'));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating user';
      dispatch(setUserError(errorMessage));
      return null;
    } finally {
      dispatch(setUserLoading(false));
    }
  }
);

// Action thunk pour la connexion utilisateur
export const userDispatch = (userData: IUser, userToken: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(setCurrentUser(userData));
    dispatch(setUserSuccess(true));

    const user = {
      ...userData,
      token: userToken
    };
    localStorage.setItem('user', JSON.stringify(user));
  };
};

// Action thunk pour vérifier la validité de l'utilisateur
export const checkUserValidity = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;

  const userData = JSON.parse(user);
  return userData.validity === 'valid';
};

// Action thunk pour récupérer les clients
export const getCustomers = createAsyncThunk(
  'user/getCustomers',
  async (_, { dispatch }) => {
    try {
      dispatch(setUserLoading(true));
      const response = await axios.get('/api/customers');
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while getting customers';
      dispatch(setUserError(errorMessage));
      return null;
    } finally {
      dispatch(setUserLoading(false));
    }
  }
);

export default userSlice.reducer;
