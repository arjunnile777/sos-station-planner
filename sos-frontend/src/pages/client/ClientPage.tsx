import React, { useEffect, useRef, useState } from 'react';
import { Col, Input, Row, Table } from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import SosInputComponentType from '../../component/SosInputComponent';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPlanningByOrderNo,
  PlanningSliceSelector,
} from '../../store/slices/planning.slice';
import CustomSpinner from '../../component/CustomSpinner';
import PageHeaderPage from '../../component/PageHeaderPage';
import { PopupMessagePage } from '../../component/PopupMessagePage';
import { addClientApi, getAllClientApi } from '../../services/ClientApi';

interface PlanningPageType {
  customer_name: string;
  part_no: string;
  order_no: string;
  scanned_quantity: number;
  total_quantity: number;
}

const ClientPage = () => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    setPlanningList(individualPlanningData);
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

  // Set Spinner
  useEffect(() => {
    setIsSpinning(isPlanningLoading);
  }, [isPlanningLoading]);

  useEffect(() => {
    if (orderInputRef && orderInputRef.current) {
      orderInputRef.current!.focus({
        cursor: 'start',
      });
    }
  }, []);

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
    dispatch(getPlanningByOrderNo({ order_number: e.target.value }));
    setIsDisableOrderField(true);
    setIsDisableBarcodeField(false);
  };

  const onChangePartBarcode = async (e: any) => {
    setScannedPartBarcode(e.target.value);
    let custNumber: any = '';
    let partNumber: any = '';

    if (planningList && planningList.length > 0) {
      custNumber = planningList[0].customer_id;
      partNumber = planningList[0].part_no;
    }

    const params: any = {
      barcode: e.target.value,
      customer_id: custNumber,
      part_no: partNumber,
    };

    try {
      setIsSpinning(true);
      const response = await addClientApi(params);
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
      setScannedPartBarcode('');
    } else {
      PopupMessagePage({
        title: successResponse.message,
        type: 'warning',
      });
    }
    setIsSpinning(false);
    getScannedOrdersList();
  };

  const getScannedOrdersList = async () => {
    try {
      setIsSpinning(true);
      const response = await getAllClientApi();
      console.log('yoooooooo==', response);
      if (response && response.data) {
        setScannedOrdersList(response.data.data);
        setIsSpinning(false);
      }
    } catch (e) {
      setIsSpinning(false);
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <PageHeaderPage title="Client" isBtnVisible={false} />
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
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
                  <Table
                    className="sos-ant-table"
                    columns={columns1}
                    dataSource={scannedOrdersList}
                    bordered
                    scroll={{
                      y: 150,
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
    </>
  );
};

export default ClientPage;
