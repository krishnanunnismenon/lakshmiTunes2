import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/user/authApi";
import { userApi } from "@/services/api/user/userApi";
import authReducer from '../slice/authSlice'
import userReducer from '../slice/userSlice'
import adminReducer from '../slice/adminSlice'
import { adminApi } from "@/services/api/admin/adminApi";


const rootReducer = combineReducers({
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [adminApi.reducerPath]:adminApi.reducer,
      user:userReducer,
      auth: authReducer,
      admin:adminReducer
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(userApi.middleware)
    .concat(adminApi.middleware),
  });