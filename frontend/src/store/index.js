import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import documentReducer from './documentSlice';
import chatReducer from './chatSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
    chat: chatReducer,
    admin: adminReducer
  },
});
