import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";

// Configuration du store Redux avec Redux Toolkit
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions qui contiennent des objets Moment.js
        ignoredActions: ['serverTime/getServerTime/fulfilled'],
        ignoredPaths: ['serverTime.currentTime']
      }
    });
    
    if (process.env.NODE_ENV !== "production") {
      middleware.push(createLogger());
    }
    
    return middleware;
  },
  devTools: process.env.NODE_ENV !== 'production'
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 