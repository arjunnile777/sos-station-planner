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
  const [planningList, setPlanningList] = useState([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isDisableBarcodeField, setIsDisableBarcodeField] =
    useState<boolean>(true);

  useEffect(() => {
    setPlanningList(individualPlanningData);
  }, [individualPlanningData]);

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
    // if (barcodeInputRef && barcodeInputRef.current) {
    //   barcodeInputRef.current!.focus({
    //     cursor: 'start',
    //   });
    // }
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
      dataIndex: 'scanned_barcode',
      key: 'scanned_barcode',
    },
  ];

  const onChangeOrderNumber = (e: any) => {
    setScannedOrderNumber(e.target.value);
    dispatch(getPlanningByOrderNo({ order_number: e.target.value }));
  };

  const onChangePartBarcode = (e: any) => {
    setScannedPartBarcode(e.target.value);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Table
                className="sos-ant-table"
                columns={columns}
                dataSource={planningList}
                bordered
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{
                  y: 200,
                }}
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
                    dataSource={[]}
                    bordered
                    pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{
                      y: 200,
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
