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
import { addClientApi, getAllClientApi } from '../../services/ClientApi';
import {
  UpdatePlanningScannedQuantityType,
  UpdatePlanningType,
} from '../../types/planning/planningPayloadType';
import {
  updatePlanningiApi,
  updateScannedQuantityApi,
} from '../../services/PlanningApi';
import { useReactToPrint } from 'react-to-print';
import { getIndividualLinkageApi } from '../../services/CustomerPartLinkageApi';
import SosNotificationModalPage from '../../component/SosNotificationModalPage';

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
  const [orderCompletedModal, setOrderCompletedModal] =
    useState<boolean>(false);

  useEffect(() => {
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
        setPlanningList(individualPlanningData);
        getIndividualLinkageData(data[0]);
      }
    }
  }, [individualPlanningData]);

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

  const handleOrderDetailsPrint = useReactToPrint({
    content: () => orderDetailsTableRef.current,
    // onBeforeGetContent: () => setprintHeaderVisible(true),
  });

  const handleScannedOrdersPrint = useReactToPrint({
    content: () => scannedOrderTableRef.current,
    // onBeforeGetContent: () => setprintHeaderVisible(true),
  });

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
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
    },
  ];
  const columns1: ColumnsType<PlanningPageType> = [
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'id',
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
    if (e.target.value) {
      dispatch(getPlanningByOrderNo({ order_number: e.target.value }));
    }
  };

  const onChangePartBarcode = async (e: any) => {
    setScannedPartBarcode(e.target.value);
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
            if (response && response.data) {
              handleSuccessResponse(response.data);
            }
          } catch (e) {
            setIsSpinning(false);
          }
        } else {
          PopupMessagePage({
            title: 'Invalid barcode',
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
  };

  const handleSuccessResponse = (successResponse: any) => {
    if (successResponse) {
      PopupMessagePage({
        title: successResponse.message,
        type: 'success',
      });
      setScannedPartBarcode('');
    } else {
      PopupMessagePage({
        title: successResponse.message,
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
        setScannedOrdersList(response.data.data);
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
      if (response && response.data) {
        console.log('Updated success');
        if (planList.scanned_quantity === planList.total_quantity) {
          updateOrderCompletePlanning(planList);
        }
      }
    } catch (e) {
      console.log('Error');
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
          title: 'Your order has completed',
          type: 'success',
        });
        onClientBtnClick();
        handleScannedOrdersPrint();
      }
    } catch (e) {
      setIsSpinning(false);
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

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage
            title="Client"
            isBtnVisible={false}
            isClientBtnVisible={true}
            onClientBtnClick={onClientBtnClick}
            // onClientPrintClick={handleOrderDetailsPrint}
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
                  scroll={{
                    y: 100,
                  }}
                  pagination={false}
                />
              </div>
            </Col>
          </Row>
          <br />
          <br />
          <Row gutter={[16, 16]} className="scanner-fields-cs">
            <Col span={12}>
              <div className="sos-input-cs">
                <div className="input-label">Scan Order</div>
                <Input
                  type="text"
                  value={scannedOrderNumber}
                  name="scanOrderNumber"
                  onChange={onChangeOrderNumber}
                  disabled={isDisableOrderField}
                  ref={orderInputRef}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="sos-input-cs">
                <div className="input-label">Scan Part Barcode</div>
                <Input
                  type="text"
                  value={scannedPartBarcode}
                  name="scanBarcodeNumber"
                  onChange={onChangePartBarcode}
                  ref={barcodeInputRef}
                  disabled={isDisableBarcodeField}
                />
              </div>
              <br />
            </Col>
            <Col span={24}>
              <Row>
                <Col span={6}></Col>
                <Col span={12}>
                  <div ref={scannedOrderTableRef}>
                    <Table
                      className="sos-ant-table"
                      columns={columns1}
                      dataSource={scannedOrdersList}
                      bordered
                      scroll={{
                        y: 150,
                      }}
                      pagination={false}
                    />
                  </div>
                  {/* <div>
                    <Button
                      type="primary"
                      ghost
                      onClick={handleScannedOrdersPrint}
                      style={{ float: 'right', marginTop: '20px' }}
                    >
                      Print Scanned Orders
                    </Button>
                  </div> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
      {orderCompletedModal && (
        <SosNotificationModalPage
          onResetPrintClick={() => console.log('clickkkkkkk')}
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
