import React, { Fragment } from 'react';
import { Menu, Layout, Avatar } from 'antd';

const { SubMenu } = Menu;

const rightContent = [
  <Menu key="user" mode="horizontal">
    <SubMenu
      title={
        <Fragment>
          <span style={{ color: '#999', marginRight: 4 }}>Hi,</span>
          <span>Arjun</span>
          <Avatar style={{ marginLeft: 8 }} src={''} />
        </Fragment>
      }
    >
      <Menu.Item key="SignOut">Sign out</Menu.Item>
    </SubMenu>
  </Menu>,
];

type HeaderPageType = {
  collapsed: boolean;
};

const HeaderPage = ({ collapsed = false }: HeaderPageType) => {
  return (
    <Layout.Header
      className={`header-root ${collapsed && 'header-collapsed-root'}`}
      id="layoutHeader"
    >
      <div></div>
      <div className="rightContainer">{rightContent}</div>
    </Layout.Header>
  );
};
export default HeaderPage;
