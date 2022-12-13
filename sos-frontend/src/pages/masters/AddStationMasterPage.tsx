import React, { useEffect, useState } from 'react';
import { Col, Modal, Row, Space, Switch } from 'antd';
import { useDispatch } from 'react-redux';

import SosInputComponentType from '../../component/SosInputComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { CreateStationMasterType } from '../../types/stationMaster/stationMasterPayloadType';
import {
  addStationMasteriApi,
  updateStationMasteriApi,
} from '../../services/StationMasterApi';
import { getAllStationMasters } from '../../store/slices/stationMaster.slice';

type AddStationMasterPageType = {
  isModalOpen: boolean;
  isUpdateModal: boolean;
  updateModalData: any;
  onCloseModal: () => void;
};

type InputFieldsType = {
  nameValue: string;
  statusValue: boolean;
};

type InputErrorFieldsType = {
  nameValueError: string;
};

const AddStationMasterPage = ({
  isModalOpen = false,
  isUpdateModal = false,
  updateModalData = null,
  onCloseModal,
}: AddStationMasterPageType) => {
  const dispatch = useDispatch();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [inputFieldsValues, setInputFieldsValues] = useState<InputFieldsType>({
    nameValue: '',
    statusValue: true,
  });

  const [inputErrorFieldsValues, setInputErrorFieldsValues] =
    useState<InputErrorFieldsType>({
      nameValueError: '',
    });

  useEffect(() => {
    console.log('updateModalData==', updateModalData);
    console.log(isUpdateModal);
    if (isUpdateModal && updateModalData) {
      const fields = {
        nameValue: updateModalData.station_name,
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
    if (inputFieldsValues.nameValue) {
      const params: CreateStationMasterType = {
        station_name: inputFieldsValues.nameValue,
        status: inputFieldsValues.statusValue ? 1 : 0,
      };
      if (isUpdateModal) {
        params.id = updateModalData.id;
        handleUpdateStationMaster(params);
      } else {
        handleAddStationMaster(params);
      }
    } else {
      const fieldsObj = { ...inputErrorFieldsValues };

      if (!inputFieldsValues.nameValue)
        fieldsObj.nameValueError = 'Name is required field';

      setInputErrorFieldsValues({
        ...fieldsObj,
      });
    }
  };

  const handleAddStationMaster = async (params: CreateStationMasterType) => {
    try {
      setIsSpinning(true);
      const response = await addStationMasteriApi(params);
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

  const handleUpdateStationMaster = async (params: CreateStationMasterType) => {
    try {
      setIsSpinning(true);
      const response = await updateStationMasteriApi(params);
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
      dispatch(getAllStationMasters());
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
      title={isUpdateModal ? 'Update Station Master' : 'Add Station Master'}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isUpdateModal ? 'Update Station' : 'Add Station'}
    >
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          <SosInputComponentType
            label="Station Name"
            value={inputFieldsValues.nameValue}
            error={inputErrorFieldsValues.nameValueError}
            name="nameValue"
            onChange={onChangeInputChange}
            required
          />

          <Space className="sos-switch-cs">
            <span className="sos-switch-label">Station Status : </span>
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

export default AddStationMasterPage;
