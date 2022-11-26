import { configureStore } from '@reduxjs/toolkit';
import { CustomerMasterSlice } from './slices/customerMaster.slice';
import { PartMasterSlice } from './slices/partMaster.slice';
import { StationMasterSlice } from './slices/stationMaster.slice';

const store = configureStore({
  reducer: {
    customerMasterSlice: CustomerMasterSlice.reducer,
    partMasterSlice: PartMasterSlice.reducer,
    stationMasterSlice: StationMasterSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
