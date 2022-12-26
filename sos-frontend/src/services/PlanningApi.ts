import {
  CreatePlanningType,
  DeletePlanningType,
  PlanningAllType,
  PlanningByOrderNoType,
  UpdatePlanningScannedQuantityType,
  UpdatePlanningType,
} from '../types/planning/planningPayloadType';
import { http } from './api';

export const getAllPlanningApi = (payload?: PlanningAllType) =>
  http.post(`/planning/getAll`, payload);

export const addPlanningiApi = (payload: any) =>
  http.post(`/planning/create`, payload);

export const updatePlanningiApi = (payload: UpdatePlanningType) =>
  http.put(`/planning/updateStatus/${payload.id}`, payload);

export const updateScannedQuantityApi = (
  payload: UpdatePlanningScannedQuantityType,
) => http.put(`/planning/updateQuantity/${payload.id}`, payload);

export const deletePlanningApi = (payload: DeletePlanningType) =>
  http.put(`/planning/temp-delete/${payload.id}`);

export const getPlanningByOrderNumberApi = (payload: PlanningByOrderNoType) =>
  http.get(`/planning/getByOrderNo/${payload.order_number}`);
