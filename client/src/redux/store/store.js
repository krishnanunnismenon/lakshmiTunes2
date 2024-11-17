import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/user/authApi";
import { userApi } from "@/services/api/user/userApi";
import authReducer from '../slice/authSlice'
import userReducer from '../slice/userSlice'



export const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      user:userReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });