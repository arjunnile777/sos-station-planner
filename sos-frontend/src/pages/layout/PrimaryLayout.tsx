import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import SiderPage from './SiderPage';
import HeaderPage from './HeaderPage';
import { getLoginRole } from '../../utils/localStorage';
import { OPERATOR_LOGIN_ROLE } from '../../constants';

const { Content } = Layout;

const PrimaryLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loginRoleValue, setLoginRoleValue] = useState<string>('');
  useEffect(() => {
    const loginRole = getLoginRole();
    setLoginRoleValue(loginRole);
    if (loginRole === OPERATOR_LOGIN_ROLE) {
      setCollapsed(true);
    }
  }, []);

  return (
    <Layout>
      <SiderPage
        collapsed={collapsed}
        onCollapsed={() => setCollapsed(!collapsed)}
        loginRole={loginRoleValue}
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
