import React from "react";
import { Col, Row } from 'antd';

import { Comment, Form, Button, List, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';

import { withTranslation } from 'react-i18next'

import './chat.css';

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, value }) => (
  <div>
    <Form onFinish={onSubmit}>
      <Row>
        <Col span={20}>
          <Form.Item>
            <Input onChange={onChange} value={value} />
          </Form.Item>
        </Col>
        <Col offset={1} span={2}>
          <Form.Item>
            <Button className="sendButton" htmlType="submit" type="primary">
              <SendOutlined />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </div>
);

class chatComponent extends React.Component {

  state = {
    comments: [],
    value: '',
  };

  componentDidUpdate(prevProps) {
    if (this.props.generalMessages.length !== prevProps.generalMessages.length) {
      this.refreshMessages();
    }
  }

  componentDidMount = () => {
    this.refreshMessages();
  }

  generateComment = (messageType, author, messageContent, precedentContent) => {
    let newContent = "";
    if (Array.isArray(messageContent)) {
      messageContent.forEach(content => newContent += (this.props.t(content) + " "))
    } else {
      newContent = this.props.t(messageContent);
    }
    newContent = precedentContent ? precedentContent + newContent : newContent;
    switch (messageType) {
      case "EVENT_MESSAGE":
        return { author: "MACHINATION", content: (<p className="systemMessage">{newContent}</p>) };
      case "WITNESS_ANSWER":
        return { author: messageContent ? messageContent[0] : "", content: (<div className="witnessAnswer"><span className="question">{messageContent ? messageContent[1] : ""}</span><span className={`answer ${messageContent ? messageContent[2] : ""}`}>{this.props.t(messageContent ? messageContent[2] : "")}</span></div>) };
      default:
        return {
          author: author,
          content: (<p>{newContent}</p>)
        }
    }
  }

  refreshMessages = () => {
    const generalMessages = Object.assign([], this.props.generalMessages);
    const comments = [];
    let currentAuthor = null;
    let currentComment = {};

    generalMessages.forEach((message, i) => {
      if (currentComment.content === undefined) {
        currentComment = this.generateComment(message.messageType, message.senderUsername);
      }

      if (currentAuthor !== message.sender || message.messageType === "WITNESS_ANSWER") {
        if (currentComment.content.props.children !== "") {
          comments.push(Object.assign({}, currentComment));
          currentComment = this.generateComment(message.messageType, message.senderUsername);
        }
        currentAuthor = message.sender;
      }

      const precedentContent = currentComment.content.props.children === "" ? "" : currentComment.content.props.children + "\n";
      currentComment = this.generateComment(message.messageType, message.senderUsername, message.content, precedentContent);

      if (i === generalMessages.length - 1) {
        comments.push(Object.assign({}, currentComment));
      }
    });

    this.setState({
      comments: comments,
    });

  }

  sendMessage = () => {
    if (!this.state.value) {
      return;
    }

    this.props.dispatchSendMessage(this.state.value, 'ALL');

    this.setState({
      value: "",
    });
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { comments, value } = this.state;
    return (
      <div className="chatComponent">
        <div>
          <div className="chatView" style={this.props.height ? { height: `calc(100vh - ${this.props.height}px)` } : {}}>
            {comments.length > 0 && <CommentList comments={comments} />}
          </div>
          <Comment
            content={
              <Editor
                onChange={this.handleChange}
                onSubmit={this.sendMessage}
                value={value}
              />
            }
          />
        </div>
      </div>
    );
  }
}

export default withTranslation()(chatComponent);
