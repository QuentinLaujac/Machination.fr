import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withTranslation } from 'react-i18next';

import { Space, Typography, Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { login } from '../../actions/auth';
import { history } from '../../routers/AppRouter';
import EnumService from "../../services/enumService"
import CognitoService from '../../services/cognitoService';
import LanguageSelector from '../../components/elements/LanguageSelector';

const SigninPage = (props) => {

  const { Title } = Typography;
  const [isLoading, setLoading] = useState(false);

  const login = async values => {
    let user = {};
    try {
      setLoading(true);
      user = await CognitoService.authenticateUser(values.email, values.password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case EnumService.USER_NOT_CONFIRMED_ERROR:
          return history.push({ pathname: '/confirmRegistration', state: { email: values.email } });
        case EnumService.NETWORK_ERROR:
          return message.error(props.t('error_check_network'));
        case EnumService.NOT_AUTHORIZED_EXCEPTION:
          return message.error(props.t('error_wrong_mail_password'));
        case EnumService.USER_NOT_FOUND_ERROR:
          return message.error(props.t('error_wrong_mail_password'));
        default:
          return message.error(props.t('unknown_error'));
      }
    }
    props.dispatchStartLogin(user);
  }

  return (
    <>
      <LanguageSelector />
      <Row justify="space-around" align="middle" style={{ marginTop: "5%", marginBottom: "2.5%" }} >
        <Title className="mainTitle">MACHINATION</Title>
      </Row>
      <Row align="middle">
        <Col xs={{ span: 18, offset: 3 }} sm={{ span: 18, offset: 3 }} md={{ span: 12, offset: 6 }} lg={{ span: 8, offset: 8 }} xl={{ span: 6, offset: 9 }} style={{ "textAlign": "center" }}>
          <Form
            wrapperCol={{ span: 24 }}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={login}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: props.t('login_missing_email.label') }]}
            >
              <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder={props.t('login_placeholder_email.label')} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: props.t('login_missing_password.label') }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={props.t('login_placeholder_password.label')}
              />
            </Form.Item>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ textAlign: "right" }}>
                <a className="login-form-forgot" href="/forgetPassword">
                  {props.t('login_forgotpassword.label')}
                </a>
              </div>
              <Form.Item>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Button type="primary" shape="round" htmlType="submit" className="loginButton light-button" loading={isLoading}>
                    {props.t('login_signin.label')}
                  </Button>
                  <Form.Item>
                    {props.t('login_or.label')}
                    <Link to={"/signup"}> {props.t('login_registernow.label')}</Link>
                  </Form.Item>
                </Space>
              </Form.Item>
            </Space>
          </Form>
        </Col>
      </Row>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchStartLogin: (user) => dispatch(login(user)),
});

export default connect(undefined, mapDispatchToProps)(withTranslation()(SigninPage));
