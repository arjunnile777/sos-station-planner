import React, { useEffect, useState } from 'react';
import { Col, Modal, Row, Space, Switch } from 'antd';
import { useDispatch } from 'react-redux';

import SosInputComponentType from '../../component/SosInputComponent';
import SosTextAreaComponent from '../../component/SosTextareaComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { CreateEmployeeMasterType } from '../../types/employeeMaster/employeeMasterPayloadType';
import {
  addEmployeeMasteriApi,
  updateEmployeeMasteriApi,
} from '../../services/EmployeeMasterApi';
import { getAllEmployeeMasters } from '../../store/slices/employeeMaster.slice';

type AddEmployeeMasterPageType = {
  isModalOpen: boolean;
  isUpdateModal: boolean;
  updateModalData: any;
  onCloseModal: () => void;
};

type InputFieldsType = {
  nameValue: string;
  eidValue: string;
  roleValue: number;
  passwordValue: string;
  statusValue: boolean;
};

type InputErrorFieldsType = {
  nameValueError: string;
  eidValueError: string;
  roleValueError: string;
  passwordValueError: string;
};

const AddEmployeeMasterPage = ({
  isModalOpen = false,
  isUpdateModal = false,
  updateModalData = null,
  onCloseModal,
}: AddEmployeeMasterPageType) => {
  const dispatch = useDispatch();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [inputFieldsValues, setInputFieldsValues] = useState<InputFieldsType>({
    nameValue: '',
    eidValue: '',
    roleValue: 0,
    passwordValue: '',
    statusValue: true,
  });

  const [inputErrorFieldsValues, setInputErrorFieldsValues] =
    useState<InputErrorFieldsType>({
      nameValueError: '',
      eidValueError: '',
      roleValueError: '',
      passwordValueError: '',
    });

  useEffect(() => {
    if (isUpdateModal && updateModalData) {
      const fields = {
        nameValue: updateModalData.name,
        eidValue: updateModalData.eid,
        roleValue: updateModalData.role,
        passwordValue: updateModalData.password,
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
      inputFieldsValues.eidValue &&
      inputFieldsValues.roleValue &&
      inputFieldsValues.passwordValue
    ) {
      const params: CreateEmployeeMasterType = {
        name: inputFieldsValues.nameValue,
        eid: inputFieldsValues.eidValue,
        role: inputFieldsValues.roleValue,
        password: inputFieldsValues.passwordValue,
        status: inputFieldsValues.statusValue ? 1 : 0,
      };
      if (isUpdateModal) {
        params.id = updateModalData.id;
        handleUpdateEmployeeMaster(params);
      } else {
        handleAddEmployeeMaster(params);
      }
    } else {
      const fieldsObj = { ...inputErrorFieldsValues };

      if (!inputFieldsValues.nameValue)
        fieldsObj.nameValueError = 'Name is required field';

      if (!inputFieldsValues.eidValue)
        fieldsObj.eidValueError = 'Employee Id is required field';

      if (!inputFieldsValues.roleValue)
        fieldsObj.roleValueError = 'Role is required field';

      if (!inputFieldsValues.passwordValue)
        fieldsObj.passwordValueError = 'Password is required field';

      setInputErrorFieldsValues({
        ...fieldsObj,
      });
    }
  };

  const handleAddEmployeeMaster = async (params: CreateEmployeeMasterType) => {
    try {
      setIsSpinning(true);
      const response = await addEmployeeMasteriApi(params);
      if (response && response.data) {
        handleSuccessResponse(response.data);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleUpdateEmployeeMaster = async (
    params: CreateEmployeeMasterType,
  ) => {
    try {
      setIsSpinning(true);
      const response = await updateEmployeeMasteriApi(params);
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
      dispatch(getAllEmployeeMasters());
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
      eidValue: '',
      roleValue: 0,
      passwordValue: '',
      statusValue: false,
    };

    const fieldsError = {
      nameValueError: '',
      eidValueError: '',
      roleValueError: '',
      passwordValueError: '',
    };

    setInputFieldsValues(fieldsClear);
    setInputErrorFieldsValues(fieldsError);
  };

  return (
    <Modal
      title={isUpdateModal ? 'Update Employee Master' : 'Add Employee Master'}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isUpdateModal ? 'Update Employee' : 'Add Employee'}
    >
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          <SosInputComponentType
            label="Employee Name"
            value={inputFieldsValues.nameValue}
            error={inputErrorFieldsValues.nameValueError}
            name="nameValue"
            onChange={onChangeInputChange}
            required
          />
          <SosInputComponentType
            label="Employee ID"
            required
            value={inputFieldsValues.eidValue}
            error={inputErrorFieldsValues.eidValueError}
            name="eidValue"
            onChange={onChangeInputChange}
          />

          <SosInputComponentType
            label="Employee Role"
            required
            value={inputFieldsValues.roleValue}
            error={inputErrorFieldsValues.roleValueError}
            name="roleValue"
            onChange={onChangeInputChange}
          />
          <SosInputComponentType
            label="Password"
            required
            value={inputFieldsValues.passwordValue}
            error={inputErrorFieldsValues.passwordValueError}
            name="passwordValue"
            onChange={onChangeInputChange}
          />
          <Space className="sos-switch-cs">
            <span className="sos-switch-label">Employee Status : </span>
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

export default AddEmployeeMasterPage;
