import React, { useEffect, useState } from 'react';
import { Col, Modal, Row, Space, Switch } from 'antd';
import SosInputComponentType from '../../component/SosInputComponent';
import SosTextAreaComponent from '../../component/SosTextareaComponent';
import { CreateCustomerMasterType } from '../../types/customerMaster/CustomerMasterPayloadType';
import {
  addCustomerMasteriApi,
  updateCustomerMasteriApi,
} from '../../services/CustomerMasterApi';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { getAllCustomerMasters } from '../../store/slices/customerMaster.slice';
import { useDispatch } from 'react-redux';

type AddCustomerMasterPageType = {
  isModalOpen: boolean;
  isUpdateModal: boolean;
  updateModalData: any;
  onCloseModal: () => void;
};

type InputFieldsType = {
  nameValue: string;
  codeValue: string;
  addressValue: string;
  contactPersonValue: string;
  phoneNumberValue: string;
  statusValue: boolean;
};

type InputErrorFieldsType = {
  nameValueError: string;
  codeValueError: string;
  addressValueError: string;
  contactPersonValueError: string;
  phoneNumberValueError: string;
};

const AddCustomerMasterPage = ({
  isModalOpen = false,
  isUpdateModal = false,
  updateModalData = null,
  onCloseModal,
}: AddCustomerMasterPageType) => {
  const dispatch = useDispatch();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [inputFieldsValues, setInputFieldsValues] = useState<InputFieldsType>({
    nameValue: '',
    codeValue: '',
    addressValue: '',
    contactPersonValue: '',
    phoneNumberValue: '',
    statusValue: true,
  });

  const [inputErrorFieldsValues, setInputErrorFieldsValues] =
    useState<InputErrorFieldsType>({
      nameValueError: '',
      codeValueError: '',
      addressValueError: '',
      contactPersonValueError: '',
      phoneNumberValueError: '',
    });

  useEffect(() => {
    console.log('updateModalData==', updateModalData);
    console.log(isUpdateModal);
    if (isUpdateModal && updateModalData) {
      const fields = {
        nameValue: updateModalData.name,
        codeValue: updateModalData.code,
        addressValue: updateModalData.address,
        contactPersonValue: updateModalData.contact_person,
        phoneNumberValue: updateModalData.phone,
        statusValue: updateModalData.status === 1 ? true : false,
      };
      setInputFieldsValues(fields);
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
      inputFieldsValues.nameValue &&
      inputFieldsValues.codeValue &&
      inputFieldsValues.contactPersonValue &&
      inputFieldsValues.addressValue &&
      inputFieldsValues.phoneNumberValue
    ) {
      const params: CreateCustomerMasterType = {
        name: inputFieldsValues.nameValue,
        code: inputFieldsValues.codeValue,
        contact_person: inputFieldsValues.contactPersonValue,
        address: inputFieldsValues.addressValue,
        phone: inputFieldsValues.phoneNumberValue,
        status: inputFieldsValues.statusValue ? 1 : 0,
      };
      if (isUpdateModal) {
        params.id = updateModalData.id;
        handleUpdateCustomerMaster(params);
      } else {
        handleAddCustomerMaster(params);
      }
    } else {
      const fieldsObj = { ...inputErrorFieldsValues };

      if (!inputFieldsValues.nameValue)
        fieldsObj.nameValueError = 'Name is required field';

      if (!inputFieldsValues.codeValue)
        fieldsObj.codeValueError = 'Code is required field';

      if (!inputFieldsValues.contactPersonValue)
        fieldsObj.contactPersonValueError = 'Contact person is required field';

      if (!inputFieldsValues.addressValue)
        fieldsObj.addressValueError = 'Address is required field';

      if (!inputFieldsValues.phoneNumberValue)
        fieldsObj.phoneNumberValueError = 'Phone Number is required field';

      setInputErrorFieldsValues({
        ...fieldsObj,
      });
    }
  };

  const handleAddCustomerMaster = async (params: CreateCustomerMasterType) => {
    try {
      setIsSpinning(true);
      const response = await addCustomerMasteriApi(params);
      if (response && response.data) {
        handleSuccessResponse(response.data);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleUpdateCustomerMaster = async (
    params: CreateCustomerMasterType,
  ) => {
    try {
      setIsSpinning(true);
      const response = await updateCustomerMasteriApi(params);
      if (response && response.data) {
        handleSuccessResponse(response.data);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleSuccessResponse = (successResponse: any) => {
    if (successResponse) {
      PopupMessagePage({
        title: successResponse.message,
        type: 'success',
      });
      dispatch(getAllCustomerMasters());
      resetData();
    } else {
      PopupMessagePage({
        title: successResponse.message,
        type: 'warning',
      });
    }
    handleCancel();
    setIsSpinning(false);
  };

  const resetData = () => {
    const fieldsClear = {
      nameValue: '',
      codeValue: '',
      addressValue: '',
      contactPersonValue: '',
      phoneNumberValue: '',
      statusValue: false,
    };

    const fieldsError = {
      nameValueError: '',
      codeValueError: '',
      addressValueError: '',
      contactPersonValueError: '',
      phoneNumberValueError: '',
    };

    setInputFieldsValues(fieldsClear);
    setInputErrorFieldsValues(fieldsError);
  };

  return (
    <Modal
      title={isUpdateModal ? 'Update Customer Master' : 'Add Customer Master'}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isUpdateModal ? 'Update Customer' : 'Add Customer'}
    >
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          <SosInputComponentType
            label="Customer Name"
            value={inputFieldsValues.nameValue}
            error={inputErrorFieldsValues.nameValueError}
            name="nameValue"
            onChange={onChangeInputChange}
            required
          />
          <SosInputComponentType
            label="Code"
            required
            value={inputFieldsValues.codeValue}
            error={inputErrorFieldsValues.codeValueError}
            name="codeValue"
            onChange={onChangeInputChange}
          />
          <SosTextAreaComponent
            label="Address"
            required
            value={inputFieldsValues.addressValue}
            error={inputErrorFieldsValues.addressValueError}
            name="addressValue"
            onChange={onChangeInputChange}
          />
          <SosInputComponentType
            label="Contact Person"
            required
            value={inputFieldsValues.contactPersonValue}
            error={inputErrorFieldsValues.contactPersonValueError}
            name="contactPersonValue"
            onChange={onChangeInputChange}
          />
          <SosInputComponentType
            label="Phone Number"
            required
            value={inputFieldsValues.phoneNumberValue}
            error={inputErrorFieldsValues.phoneNumberValueError}
            name="phoneNumberValue"
            onChange={onChangeInputChange}
          />
          <Space className="sos-switch-cs">
            <span className="sos-switch-label">Customer Status : </span>
            <Switch
              checkedChildren="ACTIVE"
              unCheckedChildren="INACTIVE"
              checked={inputFieldsValues.statusValue}
              onChange={onStatusChange}
            />
          </Space>
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
    </Modal>
  );
};

export default AddCustomerMasterPage;
