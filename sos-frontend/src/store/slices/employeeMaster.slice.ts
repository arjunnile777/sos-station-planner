import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllEmployeeMasterApi } from '../../services/EmployeeMasterApi';
import { EmployeeMastersAllType } from '../../types/employeeMaster/employeeMasterPayloadType';
import { EmployeeMasterState } from '../../types/employeeMaster/employeeMasterState';
import { RootState } from '../../types/RootState';

const initialState: EmployeeMasterState = {
  isEmployeeMasterLoading: false,
  employeeMasterData: [],
  totalEmployeeMaster: 0,
};

export const getAllEmployeeMasters: any = createAsyncThunk(
  'employeeMaster/getAllEmployeeMasters',
  async (payload?: EmployeeMastersAllType) => {
    const response = await getAllEmployeeMasterApi(payload);
    return response.data;
  },
);

export const EmployeeMasterSlice = createSlice({
  name: 'employeeMaster',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      getAllEmployeeMasters.pending,
      (state: EmployeeMasterState) => {
        state.isEmployeeMasterLoading = true;
      },
    );
    builder.addCase(
      getAllEmployeeMasters.fulfilled,
      (state: EmployeeMasterState, { payload }) => {
        state.isEmployeeMasterLoading = false;
        state.employeeMasterData = payload.data;
        state.totalEmployeeMaster = payload.total_count;
      },
    );
    builder.addCase(
      getAllEmployeeMasters.rejected,
      (state: EmployeeMasterState) => {
        state.isEmployeeMasterLoading = false;
        state.employeeMasterData = [];
      },
    );
  },
});

export const EmployeeMasterSliceSelector = (state: RootState) =>
  state?.employeeMasterSlice ?? initialState;
