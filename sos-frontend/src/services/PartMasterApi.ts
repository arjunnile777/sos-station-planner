import {
  CreatePartMasterType,
  DeletePartMasterType,
  PartMastersAllType,
} from '../types/partMaster/partMasterPayloadType';
import { http } from './api';

export const getAllPartMasterApi = (payload?: PartMastersAllType) =>
  http.post(`/part/getAll`, payload);

export const getIndividualPartMasterApi = (payload: any) =>
  http.get(`/part/getById/${payload.customer_id}`);

export const addPartMasteriApi = (payload: CreatePartMasterType) =>
  http.post(`/part/create`, payload);

export const updatePartMasteriApi = (payload: CreatePartMasterType) =>
  http.put(`/part/update/${payload.id}`, payload);

export const deletePartMasterApi = (payload: DeletePartMasterType) =>
  http.put(`/part/temp-delete/${payload.id}`);
