import React from 'react';
import { withTranslation } from 'react-i18next'

import { Space, Typography, Form, Input, Button, Row, Col, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

import { history } from '../../routers/AppRouter';
import EnumService from "../../services/enumService"
import HttpService from '../../services/httpService';
import CognitoService from '../../services/cognitoService';
import LanguageSelector from '../../components/elements/LanguageSelector';


const { Step } = Steps;

const defaultState = {
  step: 0,
  email: null,
  loading: false,
}

const detailStep = [EnumService.ASK_EMAIL, EnumService.ASK_VERIFY_CODE];


const { Title } = Typography;

class SignupPage extends React.Component {

  constructor(props) {
    super(props);
    defaultState.step = props.step;
    defaultState.email = props.routerParams && props.routerParams.location ? props.routerParams.location.state.email : "";
    this.state = defaultState;
    this.steps = [
      {
        title: props.t("signupPage_register"),
      },
      {
        title: props.t("signupPage_verification"),
      },
    ];

  }

  signup = async values => {
    let result = {};
    try {
      this.setState({ loading: true });
      result = await HttpService.signup(values.username, values.email, values.password);
    } catch (err) {
      switch (err.code) {
        case EnumService.ERROR_USER_EXISTS:
          return message.error(this.props.t("signupPage_error_emailExistsException"));
        case EnumService.INVALID_PARAMETER_EXCEPTION:
          return message.error(this.props.t("signupPage_error_formatPassword"));
        case EnumService.ERROR_INVALID_PASSWORD:
          return message.error(this.props.t("signupPage_error_formatPassword"));
        default:
          return message.error(this.props.t('error_unknownEmail'));
      }
    } finally {
      this.setState({ loading: false });
    }

    this.setState({ email: values.email, step: this.state.step + 1 })
    message.success(this.props.t('signupPage_confirmationCode_emailSent') + result.codeDeliveryDetails.Destination);
  }

  confirmRegistration = async values => {
    try {
      this.setState({ loading: true });
      await CognitoService.confirmRegistration(this.state.email, values.confirmationCode);
    } catch (err) {
      if (err.code === EnumService.ERROR_CODE_MISMATCH) {
        return message.error(this.props.t('signupPage_error_codeMismatch'));
      }
      if(err.code === EnumService.ERROR_SIGNUP_NOT_AUTHORIZED) {
        return message.error(this.props.t('signupPage_error_alreadyConfirmed'))
      }
      return message.error(this.props.t('unknown_error'));
    } finally {
      this.setState({ loading: false });
    }

    message.success(this.props.t('signupPage_success_signup'));
    history.push('/');
  }

  resendConfirmationCode = async () => {
    try {
      this.setState({ loading: true });
      let result = await CognitoService.resendConfirmationCode(this.state.email);
      message.success(this.props.t('signupPage_confirmationCode_emailSent') + result.CodeDeliveryDetails.Destination);
    } catch (err) {
      message.error(this.props.t('unknown_error'));
    } finally {
      this.setState({ loading: false });
    }
  }

  render = () => {
    let mainView = (<></>);
    switch (detailStep[this.state.step]) {
      case EnumService.ASK_EMAIL:
        mainView = this.renderSignupForm();
        break;
      case EnumService.ASK_VERIFY_CODE:
        mainView = this.renderRegistrationCodeForm();
        break;
      default:
        mainView = (<></>);
    }

    return (
      <>
        <LanguageSelector />
        <Row justify="space-around" align="middle" style={{ marginTop: "5%", marginBottom: "2.5%" }} >
          <Title className="mainTitle">MACHINATION</Title>
        </Row>
        <Row align="middle">
          <Col span={4} push={10} style={{ marginTop: "-20px", marginBottom: "20px" }}>
            <Steps current={this.state.step}>
              {this.steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </Col>
        </Row>
        <Row align="middle">
          {mainView}
        </Row>
      </>
    );
  }


  renderSignupForm = () => {
    return (
      <Col span={4} push={10} style={{ "textAlign": "center" }}>
        <Form
          wrapperCol={{ span: 24 }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={(values) => { this.signup(values) }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: this.props.t('signupPage_usernameMandatory') }]}
          >
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder={this.props.t('signupPage_placeholder_username')} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: this.props.t('login_missing_email.label'),
              },
              {
                required: true,
                message: this.props.t('login_missing_email'),
              },
            ]}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder={this.props.t('login_placeholder_email.label')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: this.props.t('login_missing_password.label') }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={this.props.t('login_placeholder_password.label')}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: this.props.t('signup_confirmPassword'),
              },
              ({ getFieldValue }) => ({
                validator: (rule, value) => {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(this.props.t('signupPage_passwordNotMatch'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              type="password"
              placeholder={this.props.t('signup_confirmPassword')}
            />
          </Form.Item>
          <Form.Item>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button type="primary" shape="round" htmlType="submit" className="loginButton light-button" loading={this.state.loading}>
                {this.props.t('signupPage_register')}
              </Button>
              <Form.Item>
                {this.props.t('login_or.label')} <a href="/" >{this.props.t('forgetPasswordPage_signin')}</a>
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    );
  }

  renderRegistrationCodeForm = () => {
    return (
      <Col span={4} push={10} style={{ "textAlign": "center" }}>
        <Form
          wrapperCol={{ span: 24 }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={(values) => { this.confirmRegistration(values) }}
        >
          <Form.Item
            name="confirmationCode"
            rules={[{ required: true, message: this.props.t('signupPage_required_confirmationCode') }]}
          >
            <Input size="large" prefix={<SafetyCertificateOutlined className="site-form-item-icon" />} placeholder={this.props.t('signupPage_placeholder_confirmationCode')} />
          </Form.Item>
          <Form.Item>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button type="primary" shape="round" htmlType="submit" className="loginButton light-button" loading={this.state.loading}>
                {this.props.t('forgetPasswordPage_validate')}
              </Button>
              <Form.Item>
                <Button className="linkButton" onClick={() => { this.resendConfirmationCode() }}>{this.props.t('signupPage_resend_confirmationCode')}</Button> {this.props.t('login_or.label')} <a href="/">{this.props.t('forgetPasswordPage_signin')}</a>
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    );
  }


}


export default withTranslation()(SignupPage);
