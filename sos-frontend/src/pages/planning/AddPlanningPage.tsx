import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import SosInputComponentType from '../../component/SosInputComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import {
  CreatePlanningType,
  UpdatePlanningType,
} from '../../types/planning/planningPayloadType';
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
import { getIndividualLinkageApi } from '../../services/CustomerPartLinkageApi';
import { getIndividualCustomerMasterApi } from '../../services/CustomerMasterApi';
import { getIndividualPartMasterApi } from '../../services/PartMasterApi';
import { saveScannedDataApi } from '../../services/ClientApi';

const PLANNING_STATUS = [
  {
    value: 0,
    label: 'Open',
  },
  {
    value: 1,
    label: 'Hold',
  },
  {
    value: 2,
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
  const [planningStatus, setPlanningStatus] = useState<number>(0);
  const [planningStatusError, setPlanningStatusError] = useState('');
  const [selectedPartDescription, setSelectedPartDescription] = useState('');
  const [linkageData, setLinkageData] = useState<any>();
  const [customerData, setCustomerData] = useState<any>();
  const [partData, setPartData] = useState<any>();

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllPartNumbers());
    if (updateModalData) {
      getIndividualLinkageData(updateModalData);
      getIndividualCustomerData(updateModalData);
      getIndividualPartData(updateModalData);
    }
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
    console.log(isUpdateModal);
    if (isUpdateModal && updateModalData) {
      setSelectedCustomer(updateModalData.customer_id);
      setSelectedPart(updateModalData.part_id);
      setReleaseQuantityValue(updateModalData.total_quantity);
      setPlanningStatus(updateModalData.status);
    }
  }, []);

  const getIndividualLinkageData = async (data: any) => {
    try {
      const response = await getIndividualLinkageApi({
        customer_id: data.customer_id,
        part_id: data.part_id,
      });
      if (response && response.data) {
        setLinkageData(response.data.data[0]);
      }
    } catch (e) {
      console.log('error');
    }
  };

  const getIndividualCustomerData = async (data: any) => {
    try {
      const response = await getIndividualCustomerMasterApi({
        customer_id: data.customer_id,
      });
      if (response && response.data) {
        setCustomerData(response.data.data[0]);
      }
    } catch (e) {
      console.log('error');
    }
  };

  const getIndividualPartData = async (data: any) => {
    try {
      const response = await getIndividualPartMasterApi({
        customer_id: data.customer_id,
      });
      if (response && response.data) {
        setPartData(response.data.data[0]);
      }
    } catch (e) {
      console.log('error');
    }
  };

  const handleCancel = () => {
    resetData();
    onCloseModal();
  };

  const onChangeInputChange = (e: any) => {
    setReleaseQuantityValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (
      selectedCustomer &&
      selectedPart &&
      releaseQuantityValue &&
      (planningStatus || planningStatus === 0)
    ) {
      const custN: any = customersListData.filter(
        (item: any) => item.value == selectedCustomer,
      );
      const partN: any = partsListData.filter(
        (item: any) => item.value == selectedPart,
      );

      if (isUpdateModal) {
        const params: UpdatePlanningType = {
          id: updateModalData.id,
          status: planningStatus,
        };
        handleUpdatePlanning(params);
      } else {
        try {
          const response = await getIndividualLinkageApi({
            customer_id: selectedCustomer,
            part_id: selectedPart,
          });
          if (response && response.data) {
            const params: any = {
              customer_name: custN[0].name,
              customer_id: selectedCustomer,
              part_no: partN[0].part_no,
              part_id: selectedPart,
              scanned_quantity: '0',
              release_count: parseInt(releaseQuantityValue),
              total_quantity: response.data.data[0].quantity,
              status: planningStatus,
              customer_part_no: response.data.data[0].customer_part_no,
              address: custN[0].address,
              part_description: partN[0].part_description,
            };
            handleAddPlanning(params);
          }
        } catch (e) {
          console.log('error');
        }
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

  const handleAddPlanning = async (params: any) => {
    try {
      setIsSpinning(true);
      const response = await addPlanningiApi(params);
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

  const handleUpdatePlanning = async (params: UpdatePlanningType) => {
    try {
      setIsSpinning(true);
      const response = await updatePlanningiApi(params);
      if (response && response.status === 200 && response.data) {
        if (params.status === 2) {
          requestForCreateXml();
        }
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
      dispatch(getAllPlannings());
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

  const onPartSelectEvent = (value: string) => {
    const partN: any = partsListData.filter((item: any) => item.value == value);

    setSelectedPartDescription(partN[0].part_description);
    setSelectedPart(value);

    // if (selectedCustomer && value) {
    //   getIndividualLinkageData({
    //     customer_id: value,
    //     part_id: selectedPart,
    //   });
    // }
  };

  const requestForCreateXml = async () => {
    const dateVal = new Date();
    const mm =
      dateVal.getMonth() < 10
        ? `0${dateVal.getMonth() + 1}`
        : dateVal.getMonth() + 1;

    const dd =
      dateVal.getDate() < 10 ? `0${dateVal.getDate()}` : dateVal.getDate();

    const date = `${dd}/${mm}/${dateVal.getFullYear()}`;

    const params: any = {
      order_no: updateModalData.order_no,
      date: date,
      scanned_qty: updateModalData.scanned_quantity,
      total_qty: updateModalData.total_quantity,
      part_no: updateModalData.part_no,
      part_description: partData.part_description,
      customer_part_no: linkageData.customer_part_no,
      customer: updateModalData.customer_name,
      address: customerData.address,
      type: 'dispatch',
    };

    try {
      const response = await saveScannedDataApi(params);
      if (response && response.status === 200 && response.data) {
        console.log('*************** File Saved successfully *********');
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
    } catch (e) {
      console.log('Error=', e);
    }
  };

  const resetData = () => {
    setSelectedCustomer('');
    setSelectedPart('');
    setReleaseQuantityValue('');
    setPlanningStatus(0);
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
            disable={isUpdateModal ? true : false}
            optionsData={customersListData}
            label="Select Customer"
            name="customerName"
            placeholder="Select Customer"
            error={selectedCustomerError}
            value={selectedCustomer}
            handleChange={(value: string) => {
              setSelectedCustomer(value);
              // if (selectedPart && value) {
              //   getIndividualLinkageData({
              //     customer_id: value,
              //     part_id: selectedPart,
              //   });
              // }
            }}
            required
          />
          <SearchableSelectPage
            disable={isUpdateModal ? true : false}
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
            disabled={isUpdateModal ? true : false}
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
            handleChange={(value: number) => setPlanningStatus(value)}
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
