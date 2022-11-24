import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import SiderPage from './SiderPage';
import HeaderPage from './HeaderPage';

const { Content } = Layout;

const PrimaryLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout>
      <SiderPage
        collapsed={collapsed}
        onCollapsed={() => setCollapsed(!collapsed)}
      />
      <div className="content-container-root">
        <HeaderPage collapsed={collapsed} />
        <Layout
          className={`sos-contents-root ${
            collapsed && 'sos-contents-collapsed-root'
          }`}
        >
          <Content className="sos-content-root-menu">
            <Outlet />
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default PrimaryLayout;
