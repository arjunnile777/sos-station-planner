import {
  CreateEmployeeMasterType,
  EmployeeMastersAllType,
} from '../types/employeeMaster/employeeMasterPayloadType';
import { http } from './api';

export const getAllEmployeeMasterApi = (payload?: EmployeeMastersAllType) =>
  http.post(`/employee/getAll`, payload);

export const addEmployeeMasteriApi = (payload: CreateEmployeeMasterType) =>
  http.post(`/employee/create`, payload);

export const updateEmployeeMasteriApi = (payload: CreateEmployeeMasterType) =>
  http.put(`/employee/update/${payload.id}`, payload);

// export const deleteHolidayApi = (payload: CreatePartMasterType) =>
//   http.post(`/delete-holiday/${payload.id}`);
