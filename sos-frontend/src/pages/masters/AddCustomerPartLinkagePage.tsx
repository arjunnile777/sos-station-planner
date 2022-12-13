import React, { useEffect, useState } from 'react';
import { Checkbox, Col, Modal, Row, Space, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import SosInputComponentType from '../../component/SosInputComponent';
import SosTextAreaComponent from '../../component/SosTextareaComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { CreateCustomerPartLinkageType } from '../../types/customerPartLinkage/customerPartLinkagePayloadType';
import {
  addCustomerPartLinkageiApi,
  updateCustomerPartLinkageiApi,
} from '../../services/CustomerPartLinkageApi';
import {
  CustomerPartLinkageSliceSelector,
  getAllCustomerPartLinkage,
  getAllCustomers,
  getAllPartNumbers,
} from '../../store/slices/customerPartLinkage.slice';
import SearchableSelectPage from '../../component/SeachableSelectPage';
import { NUMBER_ONLY_REGEX } from '../../constants';

type AddCustomerPartLinkagePageType = {
  isModalOpen: boolean;
  isUpdateModal: boolean;
  updateModalData: any;
  onCloseModal: () => void;
};

type InputFieldsType = {
  customerNameValue: string;
  partNameValue: string;
  customerPartNumberValue: string;
  packagingValue: string;
  barcodeValue: string;
  statusValue: boolean;
};

type InputErrorFieldsType = {
  customerNameValueError: string;
  partNameValueError: string;
  customerPartNumberValueError: string;
  packagingValueError: string;
  barcodeValueError: string;
};

const AddCustomerPartLinkagePage = ({
  isModalOpen = false,
  isUpdateModal = false,
  updateModalData = null,
  onCloseModal,
}: AddCustomerPartLinkagePageType) => {
  const dispatch = useDispatch();
  const { customersDropdownData, partNumbersDropdownData } = useSelector(
    CustomerPartLinkageSliceSelector,
  );

  const [customersListData, setCustomersListData] = useState([]);
  const [partsListData, setPartsListData] = useState([]);
  const [selectedPartDescription, setSelectedPartDescription] = useState('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isDuplicateAllow, setIsDuplicateAllow] = useState<boolean>(false);
  const [inputFieldsValues, setInputFieldsValues] = useState<InputFieldsType>({
    customerNameValue: '',
    partNameValue: '',
    customerPartNumberValue: '',
    packagingValue: '',
    barcodeValue: '',
    statusValue: true,
  });

  const [inputErrorFieldsValues, setInputErrorFieldsValues] =
    useState<InputErrorFieldsType>({
      customerNameValueError: '',
      partNameValueError: '',
      customerPartNumberValueError: '',
      packagingValueError: '',
      barcodeValueError: '',
    });

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllPartNumbers());
  }, []);

  useEffect(() => {
    let custs: any = [];
    if (customersDropdownData.length > 0) {
      custs = customersDropdownData.map((item: any) => ({
        ...item,
        value: item.id,
        label: item.name,
      }));
    }

    setCustomersListData(custs);
  }, [customersDropdownData]);

  useEffect(() => {
    let parts: any = [];
    if (partNumbersDropdownData.length > 0) {
      parts = partNumbersDropdownData.map((item: any) => ({
        ...item,
        value: item.id,
        label: item.part_no,
      }));
    }

    setPartsListData(parts);
  }, [partNumbersDropdownData]);

  useEffect(() => {
    if (isUpdateModal && updateModalData) {
      const fields = {
        customerNameValue: updateModalData.customer_id,
        partNameValue: updateModalData.part_id,
        customerPartNumberValue: updateModalData.customer_part_no,
        packagingValue: updateModalData.quantity,
        barcodeValue: updateModalData.barcode,
        statusValue: updateModalData.status === 1 ? true : false,
      };
      setInputFieldsValues(fields);

      setIsDuplicateAllow(updateModalData.duplicate_allow ? true : false);
    }
  }, []);

  const handleCancel = () => {
    resetData();
    onCloseModal();
  };

  const onChangeInputChange = (e: any) => {
    setInputFieldsValues({
      ...inputFieldsValues,
      [e.target.name]: e.target.value,
    });
  };

  const onStatusChange = (checked: boolean) => {
    setInputFieldsValues({
      ...inputFieldsValues,
      statusValue: checked,
    });
  };

  const handleSubmit = () => {
    console.log('Entered all values=', inputFieldsValues);
    if (
      inputFieldsValues.customerNameValue &&
      inputFieldsValues.partNameValue &&
      inputFieldsValues.packagingValue &&
      NUMBER_ONLY_REGEX.test(inputFieldsValues.packagingValue) &&
      inputFieldsValues.customerPartNumberValue &&
      inputFieldsValues.barcodeValue
    ) {
      const custN: any = customersListData.filter(
        (item: any) => item.value == inputFieldsValues.customerNameValue,
      );
      const partN: any = partsListData.filter(
        (item: any) => item.value == inputFieldsValues.partNameValue,
      );

      const params: CreateCustomerPartLinkageType = {
        customer_name: custN[0].label,
        customer_id: inputFieldsValues.customerNameValue,
        part_no: partN[0].label,
        part_id: inputFieldsValues.partNameValue,
        barcode: inputFieldsValues.barcodeValue,
        status: inputFieldsValues.statusValue ? 1 : 0,
        quantity: inputFieldsValues.packagingValue,
        customer_part_no: inputFieldsValues.customerPartNumberValue,
        duplicate_allow: isDuplicateAllow,
      };

      if (isUpdateModal) {
        params.id = updateModalData.id;
        handleUpdateCustomerPartLinkage(params);
      } else {
        handleAddCustomerPartLinkage(params);
      }
    } else {
      const fieldsObj = { ...inputErrorFieldsValues };

      if (!inputFieldsValues.customerNameValue)
        fieldsObj.customerNameValueError = 'Customer name is required field';

      if (!inputFieldsValues.partNameValue)
        fieldsObj.partNameValueError = 'Part name is required field';

      if (!inputFieldsValues.packagingValue)
        fieldsObj.packagingValueError = 'Packaging is required field';
      else if (!NUMBER_ONLY_REGEX.test(inputFieldsValues.packagingValue))
        fieldsObj.packagingValueError = 'Invalid Packaging value entered.';

      if (!inputFieldsValues.customerPartNumberValue)
        fieldsObj.customerPartNumberValueError =
          'Customer part number is required field';

      if (!inputFieldsValues.barcodeValue)
        fieldsObj.barcodeValueError = 'Supplier Barcode is required field';

      setInputErrorFieldsValues({
        ...fieldsObj,
      });
    }
  };

  const handleAddCustomerPartLinkage = async (
    params: CreateCustomerPartLinkageType,
  ) => {
    try {
      setIsSpinning(true);
      const response = await addCustomerPartLinkageiApi(params);
      if (response && response.status === 200 && response.data) {
        handleSuccessResponse(response.data);
      } else {
        if (response.data && response.data.msg) {
          PopupMessagePage({
            title: response.data.msg,
            type: 'error',
          });
        } else {
          PopupMessagePage({
            title: 'Something went wrong, Please try after sometime.',
            type: 'error',
          });
        }
      }
      setIsSpinning(false);
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleUpdateCustomerPartLinkage = async (
    params: CreateCustomerPartLinkageType,
  ) => {
    try {
      setIsSpinning(true);
      const response = await updateCustomerPartLinkageiApi(params);
      if (response && response.status === 200 && response.data) {
        handleSuccessResponse(response.data);
      } else {
        if (response.data && response.data.msg) {
          PopupMessagePage({
            title: response.data.msg,
            type: 'error',
          });
        } else {
          PopupMessagePage({
            title: 'Something went wrong, Please try after sometime.',
            type: 'error',
          });
        }
      }
      setIsSpinning(false);
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleSuccessResponse = (successResponse: any) => {
    if (successResponse) {
      PopupMessagePage({
        title: successResponse.msg,
        type: 'success',
      });
      dispatch(getAllCustomerPartLinkage());
      resetData();
    } else {
      PopupMessagePage({
        title: successResponse.msg,
        type: 'warning',
      });
    }
    handleCancel();
    setIsSpinning(false);
  };

  const resetData = () => {
    const fieldsClear = {
      customerNameValue: '',
      partNameValue: '',
      customerPartNumberValue: '',
      packagingValue: '',
      barcodeValue: '',
      statusValue: false,
    };

    const fieldsError = {
      customerNameValueError: '',
      partNameValueError: '',
      customerPartNumberValueError: '',
      packagingValueError: '',
      barcodeValueError: '',
    };
    setSelectedPartDescription('');
    setInputFieldsValues(fieldsClear);
    setInputErrorFieldsValues(fieldsError);
  };

  const handleDropdownChange = (value: string, name: string) => {
    if (name === 'partNameValue') {
      const partN: any = partsListData.filter(
        (item: any) => item.value == value,
      );

      setSelectedPartDescription(partN[0].part_description);
    }
    setInputFieldsValues({
      ...inputFieldsValues,
      [name]: value,
    });
  };

  return (
    <Modal
      title={
        isUpdateModal
          ? 'Update Customer Part Linkage'
          : 'Add Customer Part Linkage'
      }
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={
        isUpdateModal
          ? 'Update Customer Part Linkage'
          : 'Add Customer Part Linkage'
      }
    >
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          <SearchableSelectPage
            optionsData={customersListData}
            label="Customer Name"
            name="customerNameValue"
            placeholder="Select Customer"
            error={inputErrorFieldsValues.customerNameValueError}
            value={inputFieldsValues.customerNameValue}
            handleChange={(value: string) =>
              handleDropdownChange(value, 'customerNameValue')
            }
            required
          />
          <SearchableSelectPage
            optionsData={partsListData}
            label="Part Number"
            name="partNameValue"
            placeholder="Select Part Number"
            error={inputErrorFieldsValues.partNameValueError}
            value={inputFieldsValues.partNameValue}
            handleChange={(value: string) =>
              handleDropdownChange(value, 'partNameValue')
            }
            required
          />
          {selectedPartDescription && (
            <div className="description-label-cs">
              {selectedPartDescription}
            </div>
          )}
          <SosInputComponentType
            label="Customer Part Number"
            required
            value={inputFieldsValues.customerPartNumberValue}
            error={inputErrorFieldsValues.customerPartNumberValueError}
            name="customerPartNumberValue"
            onChange={onChangeInputChange}
          />
          <SosInputComponentType
            label="Packaging Qty"
            required
            value={inputFieldsValues.packagingValue}
            error={inputErrorFieldsValues.packagingValueError}
            name="packagingValue"
            onChange={onChangeInputChange}
          />
          <SosInputComponentType
            label="Regular Expression"
            required
            value={inputFieldsValues.barcodeValue}
            error={inputErrorFieldsValues.barcodeValueError}
            name="barcodeValue"
            onChange={onChangeInputChange}
          />
          <Space className="sos-switch-cs">
            <span className="sos-switch-label">
              Customer Part Linkage Status :
            </span>
            <Switch
              checkedChildren="ACTIVE"
              unCheckedChildren="INACTIVE"
              checked={inputFieldsValues.statusValue}
              onChange={onStatusChange}
            />
          </Space>
          <Checkbox
            value={isDuplicateAllow}
            onChange={(e: any) => setIsDuplicateAllow(e.target.checked)}
          >
            Duplicate scan allowed ?
          </Checkbox>
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
    </Modal>
  );
};

export default AddCustomerPartLinkagePage;
