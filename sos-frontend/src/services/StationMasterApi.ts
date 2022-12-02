import {
  CreateStationMasterType,
  DeleteStationMasterType,
  StationMastersAllType,
} from '../types/stationMaster/stationMasterPayloadType';
import { http } from './api';

export const getAllStationMasterApi = (payload?: StationMastersAllType) =>
  http.post(`/station/getAll`, payload);

export const addStationMasteriApi = (payload: CreateStationMasterType) =>
  http.post(`/station/create`, payload);

export const updateStationMasteriApi = (payload: CreateStationMasterType) =>
  http.put(`/station/update/${payload.id}`, payload);

export const deleteStationMasterApi = (payload: DeleteStationMasterType) =>
  http.put(`/station/temp-delete/${payload.id}`);
