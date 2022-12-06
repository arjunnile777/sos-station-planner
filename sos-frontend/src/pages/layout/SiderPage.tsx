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
import {
  CLIENT_ROUTE,
  CUSTOMER_MASTER_ROUTE,
  CUSTOMER_PART_LINKAGE_ROUTE,
  EMPLOYEE_MASTER_ROUTE,
  KEY_CLIENT,
  KEY_CUSTOMER_MASTER,
  KEY_CUSTOMER_PART_LINKAGE,
  KEY_EMPLOYEE_MASTER,
  KEY_PART_MASTER,
  KEY_PLANNING,
  KEY_REPORTS,
  KEY_STATION_MASTER,
  PART_MASTER_ROUTE,
  PLANNING_ROUTE,
  REPORTS_ROUTE,
  STATION_MASTER_ROUTE,
} from '../../constants';
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
    getItem('Part Master', KEY_PART_MASTER, <UserOutlined />),
    getItem(
      'Customer Part Linkage',
      KEY_CUSTOMER_PART_LINKAGE,
      <UserOutlined />,
    ),
    getItem('Station Master', KEY_STATION_MASTER, <UserOutlined />),
    getItem('Employee Master', KEY_EMPLOYEE_MASTER, <UserOutlined />),
  ]),
  getItem('Planning', KEY_PLANNING, <LaptopOutlined />),
  getItem('Client', KEY_CLIENT, <UserOutlined />),
  getItem('Reports', KEY_REPORTS, <FileAddOutlined />),
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
      case KEY_PART_MASTER:
        navigate(`/${PART_MASTER_ROUTE}`);
        break;
      case KEY_CUSTOMER_PART_LINKAGE:
        navigate(`/${CUSTOMER_PART_LINKAGE_ROUTE}`);
        break;
      case KEY_STATION_MASTER:
        navigate(`/${STATION_MASTER_ROUTE}`);
        break;
      case KEY_EMPLOYEE_MASTER:
        navigate(`/${EMPLOYEE_MASTER_ROUTE}`);
        break;
      case KEY_PLANNING:
        navigate(`/${PLANNING_ROUTE}`);
        break;
      case KEY_CLIENT:
        navigate(`/${CLIENT_ROUTE}`);
        break;
      case KEY_REPORTS:
        navigate(`/${REPORTS_ROUTE}`);
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
        <div className={`sos-logo ${collapsed ? "sos-logo-collapsed": ""}`}>
          <img alt="logo" src="/images/sos-logo.jpeg" />
          {/* {collapsed ? '' : <h1>SOS</h1>} */}
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
