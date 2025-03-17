
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    transaction: transactionReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
