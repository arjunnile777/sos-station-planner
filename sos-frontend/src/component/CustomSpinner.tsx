import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

// Return value should be component
const CustomSpinner = () => (
  <Spin indicator={antIcon} className="custom-spinner-cs" />
);

export default CustomSpinner;
