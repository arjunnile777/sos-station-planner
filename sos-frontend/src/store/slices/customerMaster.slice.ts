import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomerMasterApi } from '../../services/CustomerMasterApi';
import { CustomerMastersAllType } from '../../types/customerMaster/CustomerMasterPayloadType';

import { CustomerMasterState } from '../../types/customerMaster/CustomerMasterState';
import { RootState } from '../../types/RootState';

const initialState: CustomerMasterState = {
  isCustomerMasterLoading: false,
  customerMasterData: [],
  totalCustomerMaster: 0,
};

export const getAllCustomerMasters: any = createAsyncThunk(
  'customerMaster/getAllCustomerMasters',
  async (payload?: CustomerMastersAllType) => {
    const response = await getAllCustomerMasterApi(payload);
    return response.data.data;
  },
);

export const CustomerMasterSlice = createSlice({
  name: 'customerMaster',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      getAllCustomerMasters.pending,
      (state: CustomerMasterState) => {
        state.isCustomerMasterLoading = true;
      },
    );
    builder.addCase(
      getAllCustomerMasters.fulfilled,
      (state: CustomerMasterState, { payload }) => {
        state.isCustomerMasterLoading = false;
        state.customerMasterData = payload;
        state.totalCustomerMaster = payload.length;
      },
    );
    builder.addCase(
      getAllCustomerMasters.rejected,
      (state: CustomerMasterState) => {
        state.isCustomerMasterLoading = false;
        state.customerMasterData = [];
      },
    );
  },
});

export const CustomerMasterSliceSelector = (state: RootState) =>
  state?.customerMasterSlice ?? initialState;
