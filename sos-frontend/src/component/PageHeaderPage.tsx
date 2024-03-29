import { Button, Col, Row } from 'antd';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
type PageHeaderPageType = {
  title: string;
  btnLabel?: string;
  onBtnClick?: () => void;
  isBtnVisible?: boolean;
  isClientBtnVisible?: boolean;
  onClientBtnClick?: () => void;
  onClientPrintClick?: () => void;
};

const PageHeaderPage = ({
  title = '',
  btnLabel = '',
  onBtnClick,
  onClientBtnClick,
  onClientPrintClick,
  isBtnVisible = true,
  isClientBtnVisible = false,
}: PageHeaderPageType) => {
  return (
    <Row>
      <Col span={12}>
        <h1 className="page-header-label-cs">{title}</h1>
      </Col>
      {isBtnVisible && (
        <Col span={12} style={{ textAlign: 'end', marginBottom: '10px' }}>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={onBtnClick}
          >
            {btnLabel}
          </Button>
        </Col>
      )}
      {isClientBtnVisible && (
        <Col span={12} style={{ textAlign: 'end', marginBottom: '10px' }}>
          <Button type="primary" ghost onClick={onClientBtnClick}>
            Reset
          </Button>
          {/* <Button
            type="primary"
            onClick={onClientPrintClick}
            style={{ marginLeft: '20px' }}
          >
            Print
          </Button> */}
        </Col>
      )}
    </Row>
  );
};

export default PageHeaderPage;
