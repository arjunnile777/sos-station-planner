import { CreateClientType } from '../types/client/clientPayloadType';
import { http } from './api';

export const getAllClientApi = (payload: any) =>
  http.get(`/client/getList/${payload.order_no}`);

export const addClientApi = (payload: CreateClientType) =>
  http.post(`/client/create`, payload);
