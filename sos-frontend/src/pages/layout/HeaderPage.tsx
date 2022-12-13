import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Layout, Avatar } from 'antd';
import moment from 'moment';
import { getLoginUserDetails } from '../../utils/localStorage';

const { SubMenu } = Menu;

type HeaderPageType = {
  collapsed: boolean;
};

const HeaderPage = ({ collapsed = false }: HeaderPageType) => {
  const [loginUserDetails, setLoginUserDetails] = useState<any>(null);
  useEffect(() => {
    const loginDetails = getLoginUserDetails();
    console.log('Login Details==', loginDetails);
    if (loginDetails) setLoginUserDetails(loginDetails);
  }, []);

  return (
    <Layout.Header
      className={`header-root ${collapsed && 'header-collapsed-root'}`}
      id="layoutHeader"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          width: '100%',
        }}
      >
        <span>{moment(new Date()).format('MMM DD YYYY')}</span>
      </div>
      <div className="rightContainer">
        <Menu key="user" mode="horizontal">
          <SubMenu
            title={
              <Fragment>
                <span style={{ color: '#999', marginRight: 4 }}>Hi,</span>
                <span>{loginUserDetails ? loginUserDetails.name : 'User'}</span>
                <Avatar style={{ marginLeft: 8 }} src={''} />
              </Fragment>
            }
          >
            <Menu.Item
              key="SignOut"
              onClick={() => {
                window.location.replace('/login');
              }}
            >
              Sign out
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </Layout.Header>
  );
};
export default HeaderPage;
