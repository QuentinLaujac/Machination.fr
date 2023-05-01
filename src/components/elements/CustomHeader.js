import React from "react";
import { Layout, Row, Col, Typography } from 'antd';
import LogoutButton from './LogoutButton';

const { Header } = Layout;

const { Title } = Typography;

class CustomHeader extends React.Component {

  render() {

    return (
      <Header className="header">
        <Row className="mainRow">
          <Col span="2">
            <Title className="mainTitle" level={3}>MACHINATION</Title>
          </Col>
          <Col span="1" push={20}>
            <LogoutButton />>
          </Col>
        </Row>
      </Header>
    );
  }
}

export default CustomHeader;

