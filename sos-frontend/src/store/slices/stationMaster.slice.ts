import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllStationMasterApi } from '../../services/StationMasterApi';
import { RootState } from '../../types/RootState';
import { StationMastersAllType } from '../../types/stationMaster/stationMasterPayloadType';
import { StationMasterState } from '../../types/stationMaster/stationMasterState';

const initialState: StationMasterState = {
  isStationMasterLoading: false,
  stationMasterData: [],
  totalStationMaster: 0,
};

export const getAllStationMasters: any = createAsyncThunk(
  'stationMaster/getAllStationMasters',
  async (payload?: StationMastersAllType) => {
    const response = await getAllStationMasterApi(payload);
    return response.data;
  },
);

export const StationMasterSlice = createSlice({
  name: 'stationMaster',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      getAllStationMasters.pending,
      (state: StationMasterState) => {
        state.isStationMasterLoading = true;
      },
    );
    builder.addCase(
      getAllStationMasters.fulfilled,
      (state: StationMasterState, { payload }) => {
        state.isStationMasterLoading = false;
        state.stationMasterData = payload.data;
        state.totalStationMaster = payload.total_count;
      },
    );
    builder.addCase(
      getAllStationMasters.rejected,
      (state: StationMasterState) => {
        state.isStationMasterLoading = false;
        state.stationMasterData = [];
      },
    );
  },
});

export const StationMasterSliceSelector = (state: RootState) =>
  state?.stationMasterSlice ?? initialState;
