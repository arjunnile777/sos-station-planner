import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCustomerListApi,
  getAllCustomerPartLinkageApi,
  getAllPartListApi,
  getLinkageCustomersApi,
  getLinkagePartsApi,
} from '../../services/CustomerPartLinkageApi';
import { CustomerPartLinkageAllType } from '../../types/customerPartLinkage/customerPartLinkagePayloadType';
import { CustomerPartLinkageState } from '../../types/customerPartLinkage/customerPartLinkageState';
import { RootState } from '../../types/RootState';

const initialState: CustomerPartLinkageState = {
  isCustomerPartLinkageLoading: false,
  customerPartLinkageData: [],
  customersDropdownData: [],
  partNumbersDropdownData: [],
  totalCustomerPartLinkage: 0,
  linkageCustomersDropdownData: [],
  linkagePartNumbersDropdownData: [],
};

export const getAllCustomerPartLinkage: any = createAsyncThunk(
  'customerPartLinkage/getAllCustomerPartLinkage',
  async (payload?: CustomerPartLinkageAllType) => {
    const response = await getAllCustomerPartLinkageApi(payload);
    return response.data;
  },
);

export const getAllCustomers: any = createAsyncThunk(
  'customerPartLinkage/getAllCustomers',
  async () => {
    const response = await getAllCustomerListApi();
    return response.data;
  },
);

export const getAllPartNumbers: any = createAsyncThunk(
  'customerPartLinkage/getAllPartNumbers',
  async () => {
    const response = await getAllPartListApi();
    return response.data;
  },
);

export const getAllLinkageCustomers: any = createAsyncThunk(
  'customerPartLinkage/getAllLinkageCustomers',
  async () => {
    const response = await getLinkageCustomersApi();
    return response.data;
  },
);

export const getAllLinkagePartNumbers: any = createAsyncThunk(
  'customerPartLinkage/getAllLinkagePartNumbers',
  async payload => {
    const response = await getLinkagePartsApi(payload);
    return response.data;
  },
);

export const CustomerPartLinkageSlice = createSlice({
  name: 'customerPartLinkage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      getAllCustomerPartLinkage.pending,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = true;
      },
    );
    builder.addCase(
      getAllCustomerPartLinkage.fulfilled,
      (state: CustomerPartLinkageState, { payload }) => {
        state.isCustomerPartLinkageLoading = false;
        state.customerPartLinkageData = payload.data;
        state.totalCustomerPartLinkage = payload.total_count;
      },
    );
    builder.addCase(
      getAllCustomerPartLinkage.rejected,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = false;
        state.customerPartLinkageData = [];
      },
    );

    builder.addCase(
      getAllCustomers.pending,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = true;
      },
    );
    builder.addCase(
      getAllCustomers.fulfilled,
      (state: CustomerPartLinkageState, { payload }) => {
        state.isCustomerPartLinkageLoading = false;
        state.customersDropdownData = payload.data;
      },
    );
    builder.addCase(
      getAllCustomers.rejected,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = false;
        state.customersDropdownData = [];
      },
    );

    builder.addCase(
      getAllPartNumbers.pending,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = true;
      },
    );
    builder.addCase(
      getAllPartNumbers.fulfilled,
      (state: CustomerPartLinkageState, { payload }) => {
        state.isCustomerPartLinkageLoading = false;
        state.partNumbersDropdownData = payload.data;
      },
    );
    builder.addCase(
      getAllPartNumbers.rejected,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = false;
        state.partNumbersDropdownData = [];
      },
    );

    builder.addCase(
      getAllLinkageCustomers.pending,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = true;
      },
    );
    builder.addCase(
      getAllLinkageCustomers.fulfilled,
      (state: CustomerPartLinkageState, { payload }) => {
        state.isCustomerPartLinkageLoading = false;
        state.linkageCustomersDropdownData = payload.data;
      },
    );
    builder.addCase(
      getAllLinkageCustomers.rejected,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = false;
        state.linkageCustomersDropdownData = [];
      },
    );

    builder.addCase(
      getAllLinkagePartNumbers.pending,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = true;
      },
    );
    builder.addCase(
      getAllLinkagePartNumbers.fulfilled,
      (state: CustomerPartLinkageState, { payload }) => {
        state.isCustomerPartLinkageLoading = false;
        state.linkagePartNumbersDropdownData = payload.data;
      },
    );
    builder.addCase(
      getAllLinkagePartNumbers.rejected,
      (state: CustomerPartLinkageState) => {
        state.isCustomerPartLinkageLoading = false;
        state.linkagePartNumbersDropdownData = [];
      },
    );
  },
});

export const CustomerPartLinkageSliceSelector = (state: RootState) =>
  state?.customerPartLinkageSlice ?? initialState;
