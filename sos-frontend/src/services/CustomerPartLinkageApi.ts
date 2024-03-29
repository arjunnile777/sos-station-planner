import {
  CreateCustomerPartLinkageType,
  CustomerPartLinkageAllType,
  DeleteCustomerPartLinkageType,
} from '../types/customerPartLinkage/customerPartLinkagePayloadType';
import { http } from './api';

export const getAllCustomerPartLinkageApi = (
  payload?: CustomerPartLinkageAllType,
) => http.post(`/customer-part/getAll`, payload);

export const getAllCustomerListApi = () =>
  http.get(`/customer/getAllCustomers`);

export const getAllPartListApi = () => http.get(`/part/getAllParts`);

export const getIndividualLinkageApi = (payload: any) =>
  http.get(
    `/customer-part/getIndividualLinkage/${payload.customer_id}/${payload.part_id}`,
  );

export const getLinkageCustomersApi = () =>
  http.get(`/customer-part/getLinkageCustomersList`);

export const getLinkagePartsApi = (payload: any) =>
  http.get(`/customer-part/getLinkagePartsList/${payload.customer_id}`);

export const addCustomerPartLinkageiApi = (
  payload: CreateCustomerPartLinkageType,
) => http.post(`/customer-part/create`, payload);

export const updateCustomerPartLinkageiApi = (
  payload: CreateCustomerPartLinkageType,
) => http.put(`/customer-part/update/${payload.id}`, payload);

export const deleteCustomerPartLinkageApi = (
  payload: DeleteCustomerPartLinkageType,
) => http.put(`/customer-part/temp-delete/${payload.id}`);
