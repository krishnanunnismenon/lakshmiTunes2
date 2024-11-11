import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/authApi";
import authReducer from '../slice/authSlice'

export const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });