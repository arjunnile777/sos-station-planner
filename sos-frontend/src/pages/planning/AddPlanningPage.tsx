import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import SosInputComponentType from '../../component/SosInputComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { CreatePlanningType } from '../../types/planning/planningPayloadType';
import {
  addPlanningiApi,
  updatePlanningiApi,
} from '../../services/PlanningApi';
import { getAllPlannings } from '../../store/slices/planning.slice';
import SearchableSelectPage from '../../component/SeachableSelectPage';
import {
  CustomerPartLinkageSliceSelector,
  getAllCustomers,
  getAllPartNumbers,
} from '../../store/slices/customerPartLinkage.slice';

const PLANNING_STATUS = [
  {
    value: '0',
    label: 'Open',
  },
  {
    value: '1',
    label: 'Hold',
  },
  {
    value: '2',
    label: 'Dispatch',
  },
];

type AddPlanningPageType = {
  isModalOpen: boolean;
  isUpdateModal: boolean;
  updateModalData: any;
  onCloseModal: () => void;
};

const AddPlanningPage = ({
  isModalOpen = false,
  isUpdateModal = false,
  updateModalData = null,
  onCloseModal,
}: AddPlanningPageType) => {
  const dispatch = useDispatch();
  const { customersDropdownData, partNumbersDropdownData } = useSelector(
    CustomerPartLinkageSliceSelector,
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [customersListData, setCustomersListData] = useState([]);
  const [partsListData, setPartsListData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedCustomerError, setSelectedCustomerError] = useState('');
  const [selectedPartError, setSelectedPartError] = useState('');
  const [releaseQuantityValue, setReleaseQuantityValue] = useState('');
  const [releaseQuantityValueError, setReleaseQuantityValueError] =
    useState('');
  const [planningStatus, setPlanningStatus] = useState('0');
  const [planningStatusError, setPlanningStatusError] = useState('');
  const [selectedPartDescription, setSelectedPartDescription] = useState('');

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
    console.log('updateModalData==', updateModalData);
    console.log(isUpdateModal);
    if (isUpdateModal && updateModalData) {
      setSelectedCustomer(updateModalData.customer_id);
      setSelectedPart(updateModalData.part_id);
      setReleaseQuantityValue(updateModalData.qty);
      setPlanningStatus(updateModalData.status);
    }
  }, []);

  const handleCancel = () => {
    resetData();
    onCloseModal();
  };

  const onChangeInputChange = (e: any) => {
    setReleaseQuantityValue(e.target.value);
  };

  const handleSubmit = () => {
    if (
      selectedCustomer &&
      selectedPart &&
      releaseQuantityValue &&
      planningStatus
    ) {
      const custN: any = customersListData.filter(
        (item: any) => item.value == selectedCustomer,
      );
      const partN: any = partsListData.filter(
        (item: any) => item.value == selectedPart,
      );

      const params: CreatePlanningType = {
        customer_name: custN[0].name,
        customer_id: selectedCustomer,
        part_no: partN[0].part_no,
        part_id: selectedPart,
        scanned_quantity: '0',
        total_quantity: releaseQuantityValue,
        status: planningStatus,
      };

      if (isUpdateModal) {
        params.id = updateModalData.id;
        handleUpdatePlanning(params);
      } else {
        handleAddPlanning(params);
      }
    } else {
      if (!selectedCustomer)
        setSelectedCustomerError('Customer Name required.');
      if (!selectedPart) setSelectedPartError('Part Number required.');
      if (!releaseQuantityValue)
        setReleaseQuantityValueError('Release Quantity required.');
      if (!planningStatus) setPlanningStatusError('Planning Status required.');
    }
  };

  const handleAddPlanning = async (params: CreatePlanningType) => {
    try {
      setIsSpinning(true);
      const response = await addPlanningiApi(params);
      if (response && response.data) {
        handleSuccessResponse(response.data);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleUpdatePlanning = async (params: CreatePlanningType) => {
    try {
      setIsSpinning(true);
      const response = await updatePlanningiApi(params);
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
      dispatch(getAllPlannings());
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

  const onPartSelectEvent = (value: string) => {
    const partN: any = partsListData.filter((item: any) => item.value == value);

    setSelectedPartDescription(partN[0].part_description);
    setSelectedPart(value);
  };

  const resetData = () => {
    setSelectedCustomer('');
    setSelectedPart('');
    setReleaseQuantityValue('');
    setPlanningStatus('');
    setSelectedCustomerError('');
    setSelectedPartError('');
    setReleaseQuantityValueError('');
    setPlanningStatusError('');
    setSelectedPartDescription('');
  };

  return (
    <Modal
      title={isUpdateModal ? 'Update Planning' : 'Add Planning'}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isUpdateModal ? 'Update Planning' : 'Add Planning'}
    >
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          <SearchableSelectPage
            optionsData={customersListData}
            label="Select Customer"
            name="customerName"
            placeholder="Select Customer"
            error={selectedCustomerError}
            value={selectedCustomer}
            handleChange={(value: string) => setSelectedCustomer(value)}
            required
          />
          <SearchableSelectPage
            optionsData={partsListData}
            label="Select Part"
            name="partNameValue"
            placeholder="Select Part Number"
            error={selectedPartError}
            value={selectedPart}
            handleChange={onPartSelectEvent}
            required
          />
          {selectedPartDescription && (
            <div className="description-label-cs">
              {selectedPartDescription}
            </div>
          )}
          <SosInputComponentType
            label="Release Quantity"
            value={releaseQuantityValue}
            error={releaseQuantityValueError}
            name="releaseQtyName"
            onChange={onChangeInputChange}
            required
          />

          <SearchableSelectPage
            optionsData={PLANNING_STATUS}
            label="Planning Status"
            name="planningStatusName"
            placeholder="Select Status"
            error={planningStatusError}
            value={planningStatus}
            handleChange={(value: string) => setPlanningStatus(value)}
            required
            showSearch={false}
          />
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
    </Modal>
  );
};

export default AddPlanningPage;
