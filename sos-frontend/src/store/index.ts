import { configureStore } from '@reduxjs/toolkit';
import { CustomerMasterSlice } from './slices/customerMaster.slice';

const store = configureStore({
  reducer: {
    customerMasterSlice: CustomerMasterSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
