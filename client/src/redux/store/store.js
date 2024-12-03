import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/user/authApi";
import { userApi } from "@/services/api/user/userApi";
import authReducer from '../slice/authSlice'
import userReducer from '../slice/userSlice'
import adminReducer from '../slice/adminSlice'
import { adminApi } from "@/services/api/admin/adminApi";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', "token"]
}

const adminPersistConfig = {
  key: 'admin',
  storage,
  whitelist: ["isAuthenticated", "token", "role"]
}

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  user: userReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  admin: persistReducer(adminPersistConfig, adminReducer)
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, userApi.middleware, adminApi.middleware),
})

export const persistor = persistStore(store);