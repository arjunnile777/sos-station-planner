import {
  CreateCustomerMasterType,
  CustomerMastersAllType,
} from '../types/customerMaster/CustomerMasterPayloadType';
import { http } from './api';

export const getAllCustomerMasterApi = (payload?: CustomerMastersAllType) =>
  http.post(`/customer/getAll`, payload);

export const addCustomerMasteriApi = (payload: CreateCustomerMasterType) =>
  http.post(`/customer/create`, payload);

export const updateCustomerMasteriApi = (payload: CreateCustomerMasterType) =>
  http.put(`/customer/update/${payload.id}`, payload);

// export const deleteHolidayApi = (payload: CreateCustomerMasterType) =>
//   http.post(`/delete-holiday/${payload.id}`);
