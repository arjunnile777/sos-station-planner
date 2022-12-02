import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPartMasterApi } from '../../services/PartMasterApi';
import { PartMastersAllType } from '../../types/partMaster/partMasterPayloadType';
import { PartMasterState } from '../../types/partMaster/PartMasterState';
import { RootState } from '../../types/RootState';

const initialState: PartMasterState = {
  isPartMasterLoading: false,
  partMasterData: [],
  totalPartMaster: 0,
};

export const getAllPartMasters: any = createAsyncThunk(
  'partMaster/getAllPartMasters',
  async (payload?: PartMastersAllType) => {
    const response = await getAllPartMasterApi(payload);
    return response.data;
  },
);

export const PartMasterSlice = createSlice({
  name: 'partMaster',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllPartMasters.pending, (state: PartMasterState) => {
      state.isPartMasterLoading = true;
    });
    builder.addCase(
      getAllPartMasters.fulfilled,
      (state: PartMasterState, { payload }) => {
        state.isPartMasterLoading = false;
        state.partMasterData = payload.data;
        state.totalPartMaster = payload.total_count;
      },
    );
    builder.addCase(getAllPartMasters.rejected, (state: PartMasterState) => {
      state.isPartMasterLoading = false;
      state.partMasterData = [];
    });
  },
});

export const PartMasterSliceSelector = (state: RootState) =>
  state?.partMasterSlice ?? initialState;
