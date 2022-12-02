import { configureStore } from '@reduxjs/toolkit';
import { CustomerMasterSlice } from './slices/customerMaster.slice';
import { CustomerPartLinkageSlice } from './slices/customerPartLinkage.slice';
import { EmployeeMasterSlice } from './slices/employeeMaster.slice';
import { PartMasterSlice } from './slices/partMaster.slice';
import { PlanningSlice } from './slices/planning.slice';
import { StationMasterSlice } from './slices/stationMaster.slice';

const store = configureStore({
  reducer: {
    customerMasterSlice: CustomerMasterSlice.reducer,
    partMasterSlice: PartMasterSlice.reducer,
    stationMasterSlice: StationMasterSlice.reducer,
    customerPartLinkageSlice: CustomerPartLinkageSlice.reducer,
    employeeMasterSlice: EmployeeMasterSlice.reducer,
    planningSlice: PlanningSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
