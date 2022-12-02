import React, { useEffect, useState } from 'react';
import { Col, Modal, Row, Space, Switch } from 'antd';
import { useDispatch } from 'react-redux';

import SosInputComponentType from '../../component/SosInputComponent';
import SosTextAreaComponent from '../../component/SosTextareaComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { CreatePartMasterType } from '../../types/partMaster/partMasterPayloadType';
import {
  addPartMasteriApi,
  updatePartMasteriApi,
} from '../../services/PartMasterApi';
import { getAllPartMasters } from '../../store/slices/partMaster.slice';

type AddPartMasterPageType = {
  isModalOpen: boolean;
  isUpdateModal: boolean;
  updateModalData: any;
  onCloseModal: () => void;
};

type InputFieldsType = {
  partNumber: string;
  uomValue: string;
  partDescription: string;
  statusValue: boolean;
};

type InputErrorFieldsType = {
  partNumberError: string;
  uomValueError: string;
  partDescriptionError: string;
};

const AddPartMasterPage = ({
  isModalOpen = false,
  isUpdateModal = false,
  updateModalData = null,
  onCloseModal,
}: AddPartMasterPageType) => {
  const dispatch = useDispatch();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [inputFieldsValues, setInputFieldsValues] = useState<InputFieldsType>({
    partNumber: '',
    uomValue: '',
    partDescription: '',
    statusValue: true,
  });

  const [inputErrorFieldsValues, setInputErrorFieldsValues] =
    useState<InputErrorFieldsType>({
      partNumberError: '',
      uomValueError: '',
      partDescriptionError: '',
    });

  useEffect(() => {
    if (isUpdateModal && updateModalData) {
      const fields = {
        partNumber: updateModalData.part_no,
        uomValue: updateModalData.uom,
        partDescription: updateModalData.part_description,
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
      inputFieldsValues.partNumber &&
      inputFieldsValues.uomValue &&
      inputFieldsValues.partDescription
    ) {
      const params: CreatePartMasterType = {
        part_no: inputFieldsValues.partNumber,
        uom: inputFieldsValues.uomValue,
        part_description: inputFieldsValues.partDescription,
        status: inputFieldsValues.statusValue ? 1 : 0,
      };
      if (isUpdateModal) {
        params.id = updateModalData.id;
        handleUpdatePartMaster(params);
      } else {
        handleAddPartMaster(params);
      }
    } else {
      const fieldsObj = { ...inputErrorFieldsValues };

      if (!inputFieldsValues.partNumber)
        fieldsObj.partNumberError = 'Part number is required field';

      if (!inputFieldsValues.uomValue)
        fieldsObj.uomValueError = 'UOM is required field';

      if (!inputFieldsValues.partDescription)
        fieldsObj.partDescriptionError = 'Part description is required field';

      setInputErrorFieldsValues({
        ...fieldsObj,
      });
    }
  };

  const handleAddPartMaster = async (params: CreatePartMasterType) => {
    try {
      setIsSpinning(true);
      const response = await addPartMasteriApi(params);
      if (response && response.data) {
        handleSuccessResponse(response.data);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleUpdatePartMaster = async (params: CreatePartMasterType) => {
    try {
      setIsSpinning(true);
      const response = await updatePartMasteriApi(params);
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
      dispatch(getAllPartMasters());
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
      partNumber: '',
      uomValue: '',
      partDescription: '',
      statusValue: false,
    };

    const fieldsError = {
      partNumberError: '',
      uomValueError: '',
      partDescriptionError: '',
    };

    setInputFieldsValues(fieldsClear);
    setInputErrorFieldsValues(fieldsError);
  };

  return (
    <Modal
      title={isUpdateModal ? 'Update Part Master' : 'Add Part Master'}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isUpdateModal ? 'Update Part' : 'Add Part'}
    >
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          <SosInputComponentType
            label="Part Number"
            value={inputFieldsValues.partNumber}
            error={inputErrorFieldsValues.partNumberError}
            name="partNumber"
            onChange={onChangeInputChange}
            required
          />
          <SosTextAreaComponent
            label="Part Description"
            required
            value={inputFieldsValues.partDescription}
            error={inputErrorFieldsValues.partDescriptionError}
            name="partDescription"
            onChange={onChangeInputChange}
          />
          <SosInputComponentType
            label="UOM"
            required
            value={inputFieldsValues.uomValue}
            error={inputErrorFieldsValues.uomValueError}
            name="uomValue"
            onChange={onChangeInputChange}
          />

          <Space className="sos-switch-cs">
            <span className="sos-switch-label">Part Status : </span>
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

export default AddPartMasterPage;
