import React from "react";
import './stepStatus.css';
import { withTranslation } from 'react-i18next'

import { Progress, Row } from 'antd';


class StepStatus extends React.Component {

    state = {
        seconds: 0,
    }

    launchCountdown = () => {
        if (this.props.duration === 0) {
            return;
        }
        clearInterval(this.timer);
        this.setState({ seconds: this.props.duration });
        this.timer = setInterval(() => this.setState({ seconds: this.state.seconds - 1 }), 1000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.duration !== this.props.duration) {
            this.launchCountdown();
        }

        if (prevState.seconds !== this.state.seconds && this.state.seconds === 0) {
            clearInterval(this.timer);
            this.props.onCountDownDone();
        }
    }

    componentDidMount() {
        this.launchCountdown();
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render = () => {
        if (!this.props.duration) {
            return (<></>);
        }
        return (
            <div className="stepStatus">
                <Row align="middle" className="rowStatus">
                    <Progress width={40} strokeColor="#4fc18a" type="circle" format={percent => this.state.seconds} percent={((this.props.duration - this.state.seconds) / this.props.duration) * 100} />
                    <span className="title">{this.props.t("stepStatus_" + this.props.stepName)}</span>
                </Row>
            </div>
        );
    }

}

export default withTranslation()(StepStatus);

