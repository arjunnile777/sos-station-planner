import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  LaptopOutlined,
  UserOutlined,
  RightOutlined,
  LeftOutlined,
  FileAddOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { CUSTOMER_MASTER_ROUTE, KEY_CUSTOMER_MASTER } from '../../constants';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Master', 'master', <UserAddOutlined />, [
    getItem('Customer Master', KEY_CUSTOMER_MASTER, <UserOutlined />),
    getItem('Part Master', 'part_master', <UserOutlined />),
    getItem('Customer Part Linkage', 'customer_part_linkage', <UserOutlined />),
    getItem('Station Master', 'station_master', <UserOutlined />),
    getItem('Employee Master', 'employee_master', <UserOutlined />),
  ]),
  getItem('Planning', 'planning', <LaptopOutlined />),
  getItem('Client', 'client', <UserOutlined />),
  getItem('Reports', 'reports', <FileAddOutlined />),
];

type SiderPageType = {
  collapsed: boolean;
  onCollapsed: () => void;
};

const SiderPage = ({ collapsed = false, onCollapsed }: SiderPageType) => {
  const navigate = useNavigate();
  const onSelectMenu = (selectedMenu: any) => {
    switch (selectedMenu.key) {
      case KEY_CUSTOMER_MASTER:
        navigate(`/${CUSTOMER_MASTER_ROUTE}`);
        break;
      default:
        navigate(`/`);
    }
  };

  return (
    <Sider
      width={200}
      theme={'dark'}
      breakpoint="lg"
      trigger={null}
      // onBreakpoint={!isMobile && onCollapseChange}
      className="sider-page-root"
      collapsible
      collapsed={collapsed}
    >
      <div className="sos-logo-cs">
        <div className="sos-logo">
          <img alt="logo" src="/images/sos-logo.png" />
          {collapsed ? '' : <h1>SOS</h1>}
        </div>
      </div>

      <div className="menuContainer-root">
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={onSelectMenu}
        />
      </div>

      <div className="ant-layout-sider-trigger" onClick={onCollapsed}>
        <span role="img" aria-label="left" className="anticon anticon-left">
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </span>
      </div>
    </Sider>
  );
};
export default SiderPage;
