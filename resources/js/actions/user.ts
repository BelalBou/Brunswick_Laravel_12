import axios from "axios";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../types/redux';

// Configuration initiale d'axios
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

export interface UserState {
  id: string | number;
  firstName: string;
  lastName: string;
  language: string;
  type: string;
  supplierId: string | number;
  emailAddress: string;
  password: string;
  token: string;
  validity: string;
}

type UserActionType = keyof UserState;
type UserActionName = `setUser${Capitalize<UserActionType>}`;

const initialState: UserState = {
  id: '',
  firstName: '',
  lastName: '',
  language: 'fr',
  type: '',
  supplierId: '',
  emailAddress: '',
  password: '',
  token: '',
  validity: 'invalid'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | number>) => {
      state.id = action.payload;
    },
    setUserFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setUserLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setUserLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setUserSupplierId: (state, action: PayloadAction<string | number>) => {
      state.supplierId = action.payload;
    },
    setUserEmailAddress: (state, action: PayloadAction<string>) => {
      state.emailAddress = action.payload;
    },
    setUserPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserValidity: (state, action: PayloadAction<string>) => {
      state.validity = action.payload;
    },
    resetUser: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken,
  setUserValidity,
  resetUser
} = userSlice.actions;

// Action thunk pour mettre à jour les informations utilisateur
export const updateUser = (userData: Partial<UserState>) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour');
    }

    // Mise à jour du localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));

    // Dispatch des actions de mise à jour
    Object.entries(data).forEach(([key, value]) => {
      const stateKey = key as UserActionType;
      switch (stateKey) {
        case 'id':
        case 'supplierId':
          dispatch(setUserId(value as string | number));
          break;
        case 'firstName':
          dispatch(setUserFirstName(value as string));
          break;
        case 'lastName':
          dispatch(setUserLastName(value as string));
          break;
        case 'language':
          dispatch(setUserLanguage(value as string));
          break;
        case 'type':
          dispatch(setUserType(value as string));
          break;
        case 'emailAddress':
          dispatch(setUserEmailAddress(value as string));
          break;
        case 'password':
          dispatch(setUserPassword(value as string));
          break;
        case 'token':
          dispatch(setUserToken(value as string));
          break;
        case 'validity':
          dispatch(setUserValidity(value as string));
          break;
      }
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Action thunk pour la connexion utilisateur
export const userDispatch = (userData: any, userToken: string, emailAddress: string, password: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(setUserId(userData.id));
    dispatch(setUserFirstName(userData.first_name));
    dispatch(setUserLastName(userData.last_name));
    dispatch(setUserLanguage(userData.language));
    dispatch(setUserType(userData.type));
    dispatch(setUserSupplierId(userData.supplier_id));
    dispatch(setUserEmailAddress(emailAddress));
    dispatch(setUserPassword(password));
    dispatch(setUserToken(userToken));
    dispatch(setUserValidity('valid'));

    const user = {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      language: userData.language,
      type: userData.type,
      supplierId: userData.supplier_id,
      emailAddress,
      password,
      token: userToken,
      validity: 'valid'
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

export default userSlice.reducer;
