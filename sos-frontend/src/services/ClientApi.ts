import { CreateClientType } from '../types/client/clientPayloadType';
import { http } from './api';

export const getAllClientApi = () => http.get(`/client/getList`);

export const addClientApi = (payload: CreateClientType) =>
  http.post(`/client/create`, payload);
