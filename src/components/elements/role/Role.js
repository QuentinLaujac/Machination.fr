import React from "react";
import './role.css';
import { withTranslation } from 'react-i18next'

import { QuestionOutlined, SketchOutlined } from '@ant-design/icons';

import { Popover, Row, Checkbox, Tooltip } from 'antd';

import roles_fr from '../../../assets/translations/role/roles_fr.json';

const roleImages = require.context('../../../assets/img/role', true);





class Role extends React.Component {
    state = {
        checked: this.props.role.checked
    }

    content = () => (
        <div >
            {roles_fr[this.props.role.role].p.map((paragraph, i) => (<p className="msg-wrapper" key={"p" + this.props.role.role + i}>{paragraph}</p>))}
        </div>
    )


    toggleSwitch = () => {
        if (this.props.role.premium || this.props.role.disabled || !this.props.onChange) {
            return;
        }
        this.props.onChange(!this.props.role.checked);
    }

    render() {
        const premiumBadge = (this.props.role.premium) ? (
            <Tooltip placement="top" title={<span>{this.props.t('Role_premiumOnly')}</span>}>
                <div className="badgePremium">
                    <SketchOutlined className="icon" />
                </div>
            </Tooltip>) : (<></>);
        const role = (this.props.role.role === undefined) ? roleImages(`./UNDEFINED.png`) : roleImages(`./${this.props.role.role}.png`);
        return (
            <div className="Role">
                <div>
                    <Row>
                        <div className="containerAvatar">
                            {this.props.checkbox ? (
                                <Checkbox
                                    className="checkboxStatus"
                                    onClick={this.toggleSwitch}
                                    checked={this.props.role.checked}
                                    style={{ width: "33px", height: "33px" }}
                                    disabled={this.props.role.premium}
                                />) : (<></>)}
                            <img onClick={this.toggleSwitch} className={"avatar " + (this.props.role.role === undefined ? " undefined" : "") + (this.props.role.checked ? " selected" : "") + (this.props.role.premium ? " premium" : "") + (this.props.role.disabled ? " disabled" : "")} alt={this.props.role.name} src={role} />
                            {this.props.info ? (
                                <Popover content={this.content} title={roles_fr[this.props.role.role].title}>
                                    <div className="badgeInfo">
                                        <QuestionOutlined className="icon" />
                                    </div>
                                </Popover>) : (<></>)}
                            {premiumBadge}
                        </div>
                    </Row>
                </div>
            </div >
        );
    }
}

export default withTranslation()(Role);

