import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import SosInputComponentType from '../../component/SosInputComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { loginApi } from '../../services/LoginApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  setAccessToken,
  setLoginRole,
  setLoginUserDetails,
} from '../../utils/localStorage';
import {
  ACCESS_TOKEN,
  LOGIN_ROLE,
  LOGIN_USER_DETAILS,
  SUPERVISOR_LOGIN_ROLE,
} from '../../constants';
const { Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [usernameValueError, setUsernameValueError] = useState<string>('');
  const [passwordValueError, setPasswordValueError] = useState<string>('');
  const [commongLoginError, setCommongLoginError] = useState<string>('');
  const [newRegisteredUser, setNewRegisteredUser] = useState<boolean>(false);

  useEffect(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(LOGIN_ROLE);
    localStorage.removeItem(LOGIN_USER_DETAILS);
    if (
      searchParams &&
      searchParams.get('new') &&
      searchParams.get('new') == '1'
    ) {
      setNewRegisteredUser(true);
    }
  }, []);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      onLoginClick();
    }
  };

  const onLoginClick = async () => {
    if (usernameValue && passwordValue) {
      setCommongLoginError('');
      setPasswordValueError('');
      setUsernameValueError('');
      const params = {
        username: usernameValue,
        password: passwordValue,
      };
      try {
        setIsSpinning(true);
        const response = await loginApi(params);
        console.log('Login Response ==', response);
        if (response && response.data) {
          setNewRegisteredUser(false);
          setUsernameValue('');
          setPasswordValue('');
          setIsSpinning(false);
          setAccessToken(response.data.token);
          setLoginUserDetails(JSON.stringify(response.data.user));
          setLoginRole(response.data.user.role);
          if (response.data.user.role === SUPERVISOR_LOGIN_ROLE) {
            navigate('/');
            navigate(0);
          } else {
            navigate('/client');
            navigate(0);
          }
        }
      } catch (e: any) {
        setCommongLoginError('Username or Password is incorrect.');
        setIsSpinning(false);
      }
    } else {
      if (!usernameValue) setUsernameValueError('Username is required');
      if (!passwordValue) setPasswordValueError('Login is required');
    }
  };

  return (
    <Modal title="Login" open={true} closable={false} footer={null} centered>
      <Row className="sos-form-root-cs">
        <Col span={3}></Col>
        <Col span={18}>
          {newRegisteredUser && (
            <div style={{ marginBottom: '20px' }}>
              <Text type="success">
                <Space>
                  <CheckCircleOutlined />
                  You have successfully registered!
                </Space>
              </Text>
            </div>
          )}

          <SosInputComponentType
            label="Username"
            value={usernameValue}
            error={usernameValueError}
            name="username"
            onChange={e => setUsernameValue(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />
          <SosInputComponentType
            label="Password"
            type="password"
            value={passwordValue}
            error={passwordValueError}
            name="password"
            onKeyDown={handleKeyDown}
            onChange={e => setPasswordValue(e.target.value)}
            required
          />

          {commongLoginError && (
            <div className="sos-error-line">{commongLoginError}</div>
          )}
          <Button
            type="primary"
            block
            style={{ marginTop: '20px', marginBottom: '50px' }}
            onClick={onLoginClick}
          >
            LOGIN
          </Button>
          {/* <div>
            Do you want to register new user ?{' '}
            <a href="/new-register">Click Here</a>
          </div> */}
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
    </Modal>
  );
};

export default LoginPage;
