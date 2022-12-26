import {
  CreateCustomerMasterType,
  CustomerMastersAllType,
  DeleteCustomerMasterType,
} from '../types/customerMaster/CustomerMasterPayloadType';
import { http } from './api';

export const getAllCustomerMasterApi = (payload?: CustomerMastersAllType) =>
  http.post(`/customer/getAll`, payload);

export const getIndividualCustomerMasterApi = (payload: any) =>
  http.get(`/customer/getById/${payload.customer_id}`);

export const addCustomerMasteriApi = (payload: CreateCustomerMasterType) =>
  http.post(`/customer/create`, payload);

export const updateCustomerMasteriApi = (payload: CreateCustomerMasterType) =>
  http.put(`/customer/update/${payload.id}`, payload);

export const deleteCustomerMasterApi = (payload: DeleteCustomerMasterType) =>
  http.put(`/customer/temp-delete/${payload.id}`);
