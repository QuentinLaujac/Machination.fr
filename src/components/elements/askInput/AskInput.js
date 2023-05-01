import React from "react";
import './askInput.css';

import { Col, Row, Form, Button, Input } from 'antd';

class AskInput extends React.Component {

    state = {
        value: '',
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    sendMessage = () => {
        if (!this.state.value) {
            return;
        }

        this.props.onSubmit(this.state.value);

        this.setState({
            value: "",
        });
    };

    render() {
        const { value } = this.state;
        return (
            <div className="askInput">
                <Form onFinish={this.sendMessage}>
                    <Row>
                        <Col span={20}>
                            <Form.Item>
                                <Input placeholder={this.props.placeholder} onChange={this.handleChange} value={value} disabled={this.props.disabled} />
                            </Form.Item>
                        </Col>
                        <Col offset={1} span={2}>
                            <Form.Item>
                                <Button loading={this.props.loading} className={`sendButton ${this.props.disabled ? "disabled" : ""}`} htmlType="submit" type="primary" disabled={this.props.disabled} >
                                    {this.props.loading ? (<></>) : this.props.icon}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default AskInput;

