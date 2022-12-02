import { CustomerMasterState } from './customerMaster/CustomerMasterState';
import { CustomerPartLinkageState } from './customerPartLinkage/customerPartLinkageState';
import { EmployeeMasterState } from './employeeMaster/employeeMasterState';
import { PartMasterState } from './partMaster/PartMasterState';
import { PlanningState } from './planning/planningState';
import { StationMasterState } from './stationMaster/stationMasterState';

export type RootState = {
  customerMasterSlice: CustomerMasterState;
  partMasterSlice: PartMasterState;
  stationMasterSlice: StationMasterState;
  employeeMasterSlice: EmployeeMasterState;
  customerPartLinkageSlice: CustomerPartLinkageState;
  planningSlice: PlanningState;
};
