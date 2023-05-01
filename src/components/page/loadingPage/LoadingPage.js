import React from "react";


import { withTranslation } from 'react-i18next'
import { Row } from 'antd';

import ReactTypingEffect from 'react-typing-effect';


import './loadingPage.css';

class LoadingPage extends React.Component {

    render() {
        return (
            <div className="loadingPage">
                <Row className="mainRow" align="middle">
                    <ReactTypingEffect className="textLoading"  style={{ width: "100%" }} text={this.props.t('lobbyGame_murderInProgress')} />
                </Row>
            </div>
        );
    }
}

export default withTranslation()(LoadingPage);
