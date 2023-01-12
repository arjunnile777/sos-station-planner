import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Row, Table } from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useDispatch, useSelector } from 'react-redux';
import {
  getPlanningByOrderNo,
  PlanningSliceSelector,
} from '../../store/slices/planning.slice';
import CustomSpinner from '../../component/CustomSpinner';
import PageHeaderPage from '../../component/PageHeaderPage';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import {
  addClientApi,
  getAllClientApi,
  saveScannedDataApi,
} from '../../services/ClientApi';
import {
  UpdatePlanningScannedQuantityType,
  UpdatePlanningType,
} from '../../types/planning/planningPayloadType';
import {
  updatePlanningiApi,
  updateScannedQuantityApi,
} from '../../services/PlanningApi';
import { getIndividualLinkageApi } from '../../services/CustomerPartLinkageApi';
import SosNotificationModalPage from '../../component/SosNotificationModalPage';
import { getIndividualCustomerMasterApi } from '../../services/CustomerMasterApi';
import { getIndividualPartMasterApi } from '../../services/PartMasterApi';
import {
  getLoginUserDetails,
  removeDispatchEvent,
} from '../../utils/localStorage';
import { ORDER_STATUS_CHANGE } from '../../constants';

interface PlanningPageType {
  customer_name: string;
  part_no: string;
  order_no: string;
  scanned_quantity: number;
  total_quantity: number;
}

const ClientPage = () => {
  const dispatch = useDispatch();
  const orderDetailsTableRef: any = useRef();
  const scannedOrderTableRef: any = useRef();
  const orderInputRef = useRef<InputRef>(null);
  const barcodeInputRef = useRef<InputRef>(null);

  const { isPlanningLoading, individualPlanningData } = useSelector(
    PlanningSliceSelector,
  );
  const [scannedOrderNumber, setScannedOrderNumber] = useState('');
  const [scannedPartBarcode, setScannedPartBarcode] = useState('');
  const [planningList, setPlanningList] = useState<any>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isDisableBarcodeField, setIsDisableBarcodeField] =
    useState<boolean>(true);
  const [isDisableOrderField, setIsDisableOrderField] =
    useState<boolean>(false);
  const [scannedOrdersList, setScannedOrdersList] = useState<any>([]);
  const [linkageData, setLinkageData] = useState<any>();
  const [customerData, setCustomerData] = useState<any>();
  const [partData, setPartData] = useState<any>();
  const [orderCompletedModal, setOrderCompletedModal] =
    useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('storage', onStorageUpdate);
    return () => {
      window.removeEventListener('storage', onStorageUpdate);
    };
  }, []);

  const onStorageUpdate = (e: any) => {
    const { key } = e;
    if (key === ORDER_STATUS_CHANGE) {
      removeDispatchEvent();
      onClientBtnClick();
    }
  };

  useEffect(() => {
    console.log('Individuallll===', individualPlanningData);
    if (individualPlanningData.length > 0) {
      const data: any = individualPlanningData;
      if (data[0].scanned_quantity == data[0].total_quantity) {
        // Order already completed.
        setOrderCompletedModal(!orderCompletedModal);
      } else if (data[0].status == 1) {
        PopupMessagePage({
          title: 'Order on HOLD.',
          type: 'error',
        });
      } else if (data[0].status == 2) {
        setOrderCompletedModal(!orderCompletedModal);
      } else {
        setIsDisableOrderField(true);
        setIsDisableBarcodeField(false);
      }
      setPlanningList(individualPlanningData);
      getIndividualLinkageData(data[0]);
      getIndividualCustomerData(data[0]);
      getIndividualPartData(data[0]);
    }
  }, [individualPlanningData]);

  useEffect(() => {
    if (planningList) getScannedOrdersList();
  }, [planningList]);

  useEffect(() => {
    if (!isDisableBarcodeField) {
      if (barcodeInputRef && barcodeInputRef.current) {
        barcodeInputRef.current!.focus({
          cursor: 'start',
        });
      }
    }
  }, [isDisableBarcodeField]);

  useEffect(() => {
    if (!isDisableOrderField) {
      if (orderInputRef && orderInputRef.current) {
        orderInputRef.current!.focus({
          cursor: 'start',
        });
      }
    }
  }, [isDisableOrderField]);

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isPlanningLoading);
  }, [isPlanningLoading]);

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

  const columns: ColumnsType<PlanningPageType> = [
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
      key: 'customer_name',
    },
    {
      title: 'Part Number',
      dataIndex: 'part_no',
      key: 'part_no',
    },
    {
      title: 'Order Number',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: 'Scanned Count',
      dataIndex: 'scanned_quantity',
      key: 'scanned_quantity',
      width: '120px',
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: '120px',
    },
  ];
  const columns1: ColumnsType<PlanningPageType> = [
    {
      title: 'S.No',
      dataIndex: 'index_id',
      key: 'index_id',
      width: '100px',
    },
    {
      title: 'Scanned Order Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
  ];

  const onChangeOrderNumber = (e: any) => {
    setScannedOrderNumber(e.target.value);
  };

  const onEnterOrderNumberSubmit = (e: any) => {
    if (e.key === 'Enter') {
      if (e.target.value) {
        dispatch(getPlanningByOrderNo({ order_number: e.target.value }));
      }
    }
  };

  const onChangePartBarcode = (e: any) => {
    setScannedPartBarcode(e.target.value);
  };

  const onEnterPartBarcodeSubmit = async (e: any) => {
    if (e.key === 'Enter') {
      if (e.target.value) {
        if (
          linkageData &&
          linkageData.barcode &&
          planningList[0].scanned_quantity < planningList[0].total_quantity
        ) {
          const regexStr = new RegExp(linkageData.barcode);
          if (regexStr.test(e.target.value)) {
            let custNumber: any = '';
            let partNumber: any = '';
            let orderNo: any = '';
            if (planningList && planningList.length > 0) {
              custNumber = planningList[0].customer_id;
              partNumber = planningList[0].part_no;
              orderNo = planningList[0].order_no;
            }

            const params: any = {
              barcode: e.target.value,
              customer_id: custNumber,
              part_no: partNumber,
              order_no: orderNo,
              isduplicate: linkageData.duplicate_allow,
            };

            console.log('Parameter to add scanned barcode');
            try {
              setIsSpinning(true);
              const response = await addClientApi(params);
              console.log('teee===', response);
              if (response && response.status === 200 && response.data) {
                handleSuccessResponse(response.data);
              } else {
                setScannedPartBarcode('');
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
          } else {
            setScannedPartBarcode('');
            PopupMessagePage({
              title:
                'Entered barcode seems invalid, please try with correct barcode.',
              type: 'error',
            });
          }
        } else {
          if (
            planningList[0].scanned_quantity >= planningList[0].total_quantity
          ) {
            setOrderCompletedModal(!orderCompletedModal);
          } else {
            PopupMessagePage({
              title: 'Something went wrong, Please try again',
              type: 'error',
            });
          }
        }
      }
    }
  };

  const handleSuccessResponse = (successResponse: any) => {
    if (successResponse) {
      PopupMessagePage({
        title: successResponse.msg,
        type: 'success',
      });
      setScannedPartBarcode('');
    } else {
      PopupMessagePage({
        title: successResponse.msg,
        type: 'warning',
      });
    }
    setIsSpinning(false);
    updateScanQuantity();
    getScannedOrdersList();
  };

  const getScannedOrdersList = async () => {
    let orderNo: any = '';
    if (planningList && planningList.length > 0) {
      orderNo = planningList[0].order_no;
    }
    try {
      setIsSpinning(true);
      const response = await getAllClientApi({ order_no: orderNo });
      if (response && response.data) {
        const cData = response.data.data.map((item: any, index: number) => ({
          ...item,
          index_id: index + 1,
        }));
        setScannedOrdersList(cData);
        setIsSpinning(false);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const updateScanQuantity = async () => {
    const planList: any = { ...planningList[0] };
    console.log(planList);
    planList.scanned_quantity = parseInt(planList.scanned_quantity) + 1;

    const params: UpdatePlanningScannedQuantityType = {
      id: planList.id,
      scanned_quantity: planList.scanned_quantity,
    };

    setPlanningList([{ ...planList }]);
    try {
      const response = await updateScannedQuantityApi(params);
      if (response && response.status === 200 && response.data) {
        console.log('Updated success');
        if (planList.scanned_quantity === planList.total_quantity) {
          updateOrderCompletePlanning(planList);
        }
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

  const updateOrderCompletePlanning = async (planningList: any) => {
    const params: UpdatePlanningType = {
      id: planningList.id,
      status: 2,
    };

    try {
      setIsSpinning(true);
      const response = await updatePlanningiApi(params);
      if (response && response.data) {
        setIsSpinning(false);
        PopupMessagePage({
          title: 'Your order has completed.',
          type: 'success',
        });
        requestForCreateXml();
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const requestForCreateXml = async () => {
    const dateVal = new Date();
    const mm =
      dateVal.getMonth() < 10
        ? `0${dateVal.getMonth() + 1}`
        : dateVal.getMonth() + 1;

    const dd =
      dateVal.getDate() < 10 ? `0${dateVal.getDate()}` : dateVal.getDate();
    const seconds = dateVal.getSeconds();
    const minutes = dateVal.getMinutes();
    const hour = dateVal.getHours();

    const date = `${dd}/${mm}/${dateVal.getFullYear()} ${hour}:${minutes}:${seconds}`;
    const loggedInUserDetails = getLoginUserDetails();

    const params: any = {
      order_no: planningList[0].order_no,
      date: date,
      scanned_qty: planningList[0].total_quantity,
      total_qty: planningList[0].total_quantity,
      part_no: planningList[0].part_no,
      part_description: partData.part_description,
      customer_part_no: linkageData.customer_part_no,
      customer: planningList[0].customer_name,
      address: customerData.address,
      type: 'dispatch',
      login_user_name: loggedInUserDetails.name,
    };

    try {
      const response = await saveScannedDataApi(params);
      if (response && response.status === 200 && response.data) {
        console.log('*************** File Saved successfully *********');
        onClientBtnClick();
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

  const onClientBtnClick = () => {
    console.log('Click on reset btn');
    setPlanningList([]);
    setScannedOrdersList([]);
    setScannedOrderNumber('');
    setScannedPartBarcode('');
    setIsDisableOrderField(false);
    setIsDisableBarcodeField(true);
  };

  const handleOrderDetailsPrint = () => {
    console.log('Handle order details Print ==');
    if (
      planningList &&
      planningList.length &&
      partData &&
      linkageData &&
      customerData
    ) {
      setOrderCompletedModal(!orderCompletedModal);
      requestForCreateXml();
    } else {
      PopupMessagePage({
        title: 'Something went wrong, Please try after sometime.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage
            title="Client"
            isBtnVisible={false}
            isClientBtnVisible={true}
            onClientBtnClick={onClientBtnClick}
            onClientPrintClick={handleOrderDetailsPrint}
          />
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div ref={orderDetailsTableRef}>
                <Table
                  className="sos-ant-table"
                  columns={columns}
                  dataSource={planningList}
                  bordered
                  // scroll={{
                  //   y: 100,
                  // }}
                  pagination={false}
                />
              </div>
            </Col>
          </Row>
          <br />
          <br />
          <Row gutter={[16, 16]} className="scanner-fields-cs">
            <Col span={12}>
              <div className="sos-input-cs sos-input-client-cs">
                <div className="input-label">Scan Order</div>
                <Input
                  type="text"
                  value={scannedOrderNumber}
                  name="scanOrderNumber"
                  onKeyDown={onEnterOrderNumberSubmit}
                  onChange={onChangeOrderNumber}
                  disabled={isDisableOrderField}
                  ref={orderInputRef}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="sos-input-cs sos-input-client-cs">
                <div className="input-label">Scan Part Barcode</div>
                <Input
                  type="text"
                  value={scannedPartBarcode}
                  name="scanBarcodeNumber"
                  onKeyDown={onEnterPartBarcodeSubmit}
                  onChange={onChangePartBarcode}
                  ref={barcodeInputRef}
                  disabled={isDisableBarcodeField}
                />
              </div>
              <br />
            </Col>
            <Col span={24}>
              <div ref={scannedOrderTableRef}>
                <Table
                  className="sos-ant-table"
                  columns={columns1}
                  dataSource={scannedOrdersList}
                  bordered
                  // scroll={{
                  //   y: 150,
                  // }}
                  pagination={false}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
      {orderCompletedModal && (
        <SosNotificationModalPage
          onResetPrintClick={handleOrderDetailsPrint}
          onCloseClick={() => setOrderCompletedModal(!orderCompletedModal)}
          isModalOpen={orderCompletedModal}
          title="Order has already completed"
          descriptionText="Order has already completed. Do you want to reprint orders again."
          okText="Reprint"
        />
      )}
    </>
  );
};

export default ClientPage;
