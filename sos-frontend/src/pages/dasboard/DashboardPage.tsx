import { Col, Row } from 'antd';
import React from 'react';
const DashboardPage = () => {
  return (
    <Row>
      <Col span={24}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="/images/sos-logo.jpeg"></img>
        </div>
      </Col>
    </Row>
  );
};

export default DashboardPage;
