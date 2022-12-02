import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllPlanningApi,
  getPlanningByOrderNumberApi,
} from '../../services/PlanningApi';
import {
  PlanningAllType,
  PlanningByOrderNoType,
} from '../../types/planning/planningPayloadType';
import { PlanningState } from '../../types/planning/planningState';
import { RootState } from '../../types/RootState';

const initialState: PlanningState = {
  isPlanningLoading: false,
  planningData: [],
  totalPlanning: 0,
  individualPlanningData: [],
};

export const getAllPlannings: any = createAsyncThunk(
  'planning/getAllPlannings',
  async (payload?: PlanningAllType) => {
    const response = await getAllPlanningApi(payload);
    return response.data;
  },
);

export const getPlanningByOrderNo: any = createAsyncThunk(
  'planning/getPlanningByOrderNo',
  async (payload: PlanningByOrderNoType) => {
    const response = await getPlanningByOrderNumberApi(payload);
    return response.data;
  },
);

export const PlanningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllPlannings.pending, (state: PlanningState) => {
      state.isPlanningLoading = true;
    });
    builder.addCase(
      getAllPlannings.fulfilled,
      (state: PlanningState, { payload }) => {
        state.isPlanningLoading = false;
        state.planningData = payload.data;
        state.totalPlanning = payload.total_count;
      },
    );
    builder.addCase(getAllPlannings.rejected, (state: PlanningState) => {
      state.isPlanningLoading = false;
      state.planningData = [];
    });

    builder.addCase(
      getPlanningByOrderNo.fulfilled,
      (state: PlanningState, { payload }) => {
        state.isPlanningLoading = false;
        state.individualPlanningData = payload.data;
      },
    );
    builder.addCase(getPlanningByOrderNo.rejected, (state: PlanningState) => {
      state.isPlanningLoading = false;
      state.individualPlanningData = [];
    });
  },
});

export const PlanningSliceSelector = (state: RootState) =>
  state?.planningSlice ?? initialState;
