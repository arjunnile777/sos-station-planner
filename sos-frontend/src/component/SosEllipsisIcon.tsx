import React from 'react';
import { Badge } from 'antd';

type SosEllipsisIconType = {
  color?: string;
};

const SosEllipsisIcon = ({ color = '' }: SosEllipsisIconType) => {
  return (
    <div className="sos-ellipsis-icon-cs">
      <Badge color={color} status="default" />
      <Badge color={color} status="default" />
      <Badge color={color} status="default" />
    </div>
  );
};

export default SosEllipsisIcon;
