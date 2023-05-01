import React from 'react';
import { withTranslation } from 'react-i18next'

import { Space, Typography, Form, Input, Button, Row, Col, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

import { history } from '../../routers/AppRouter';

import CognitoService from '../../services/cognitoService';
import EnumService from "../../services/enumService";
import LanguageSelector from '../../components/elements/LanguageSelector';


const { Step } = Steps;

const defaultState = {
  step: 0,
  email: null,
  loading: false,
}

const { Title } = Typography;
const detailStep = [EnumService.ASK_EMAIL, EnumService.ASK_NEW_PASSWORD];

class ForgetPasswordPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = defaultState;
    this.steps = [
      {
        title: this.props.t("forgetPasswordPage_enterMail"),
      },
      {
        title: this.props.t("forgetPasswordPage_changePassword"),
      }
    ];

  }

  sendEmailConfirmationCode = async values => {
    this.setState({ email: values.email, loading: true });
    try {
      await CognitoService.forgotPassword(values.email, this.onEmailSent);
    } catch (err) {
      this.setState({ loading: false });
      if (err.code === EnumService.ERROR_LIMIT_EXCEEDED) {
        return message.error(this.props.t('forgerPasswordPage_LimitExceededException'));
      }
      console.error(err);
      return message.error(this.props.t('error_unknownEmail'));
    }
  }

  onEmailSent = data => {
    message.success(this.props.t('forgetPasswordPage_successSentMail') + data.CodeDeliveryDetails.Destination);
    this.setState({ step: this.state.step + 1, loading: false });
  }

  changePassword = async values => {
    try {
      this.setState({ loading: true });
      await CognitoService.forgotPasswordVerifyMail(this.state.email, values.confirmationCode, values.password);
    } catch (err) {
      if (err.code === EnumService.ERROR_CODE_MISMATCH) {
        return message.error(this.props.t('signupPage_error_codeMismatch'));
      }
      if (err.code === EnumService.ERROR_LIMIT_EXCEEDED) {
        return message.error(this.props.t('forgerPasswordPage_LimitExceededException'));
      }
      console.error(err);
      return message.error(this.props.t('unknown_error'));
    } finally {
      this.setState({ loading: false });
    }

    message.success(this.props.t('forgetPasswordPage_success_passwordChanged'));
    history.push('/');
  }

  render = () => {
    let mainView = (<></>);
    switch (detailStep[this.state.step]) {
      case EnumService.ASK_EMAIL:
        mainView = this.renderEmailForm();
        break;
      case EnumService.ASK_NEW_PASSWORD:
        mainView = this.renderChangePasswordForm();
        break;
      default:
        mainView = (<></>)
    }

    return (
      <>
        <LanguageSelector />
        <Row justify="space-around" align="middle" style={{ marginTop: "5%", marginBottom: "2.5%" }} >
          <Title className="mainTitle">MACHINATION</Title>
        </Row>
        <Row align="middle">
          <Col span={8} push={8} style={{ marginTop: "-20px", marginBottom: "20px" }}>
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

  renderEmailForm = () => {
    return (
      <Col span={4} push={10} style={{ "textAlign": "center" }}>
        <Form
          wrapperCol={{ span: 24 }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.sendEmailConfirmationCode}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: this.props.t('login_missing_email.label') }]}
          >
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder={this.props.t('login_placeholder_email.label')} />
          </Form.Item>
          <Form.Item>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button type="primary" shape="round" htmlType="submit" className="loginButton light-button" loading={this.state.loading}>
                {this.props.t('forgetPasswordPage_validate')}
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


  renderChangePasswordForm = () => {
    return (
      <Col span={4} push={10} style={{ "textAlign": "center" }}>
        <Form
          wrapperCol={{ span: 24 }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.changePassword}
        >
          <Form.Item
            name="confirmationCode"
            rules={[{ required: true, message: this.props.t('signupPage_required_confirmationCode') }]}
          >
            <Input size="large" prefix={<SafetyCertificateOutlined className="site-form-item-icon" />} placeholder={this.props.t('forgetPasswordPage_placeholder_confirmationCode')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: this.props.t('login_missing_password.label') }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={this.props.t('forgetPasswordPage_changePassword')}
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
                {this.props.t('forgetPasswordPage_validate')}
              </Button>
              <Form.Item>
                {this.props.t('login_or.label')} <a href="/">{this.props.t('forgetPasswordPage_signin')}</a>
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    );
  }

}

export default withTranslation()(ForgetPasswordPage);
