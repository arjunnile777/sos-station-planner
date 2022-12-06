import { http } from './api';

export const loginApi = (payload: any) => http.post(`/login`, payload);
