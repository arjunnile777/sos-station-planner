import { CustomerMasterState } from './customerMaster/CustomerMasterState';
import { EmployeeMasterState } from './employeeMaster/employeeMasterState';
import { PartMasterState } from './partMaster/PartMasterState';
import { StationMasterState } from './stationMaster/stationMasterState';

export type RootState = {
  customerMasterSlice: CustomerMasterState;
  partMasterSlice: PartMasterState;
  stationMasterSlice: StationMasterState;
  employeeMasterSlice: EmployeeMasterState;
};
