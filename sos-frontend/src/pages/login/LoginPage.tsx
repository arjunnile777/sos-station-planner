import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';

import SosInputComponentType from '../../component/SosInputComponent';
import CustomSpinner from '../../component/CustomSpinner';
import { loginApi } from '../../services/LoginApi';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../../utils/localStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [usernameValueError, setUsernameValueError] = useState<string>('');
  const [passwordValueError, setPasswordValueError] = useState<string>('');
  const [commongLoginError, setCommongLoginError] = useState<string>('');

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
          setUsernameValue('');
          setPasswordValue('');
          setIsSpinning(false);
          setAccessToken(response.data.token);
          navigate('/');
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
          <SosInputComponentType
            label="Username"
            value={usernameValue}
            error={usernameValueError}
            name="username"
            onChange={e => setUsernameValue(e.target.value)}
            required
          />
          <SosInputComponentType
            label="Password"
            type="password"
            value={passwordValue}
            error={passwordValueError}
            name="password"
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
        </Col>
      </Row>
      {isSpinning ? <CustomSpinner /> : ''}
    </Modal>
  );
};

export default LoginPage;
