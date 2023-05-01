import React from "react";
import Role from './role/Role';
import { withTranslation } from 'react-i18next'
import { Row, Col } from 'antd';

class RoleSection extends React.Component {


    onRoleCliked = (i) => {
        this.props.onRoleCliked(this.props.rolesAvailable[i]);
    }

    render() {
        const rolesMandatory = Object.assign([], this.props.rolesMandatory);
        const rolesAvailable = Object.assign([], this.props.rolesAvailable);
        const rolesChoosen = Object.assign([], this.props.rolesChoosen);
        const rolesList = Object.assign([], this.props.rolesList);
        const roles = [];
        rolesList.forEach(role => {
            const roleAvailable = rolesAvailable.filter(roleAvailable => roleAvailable.sortId === role.sortId);
            const roleChoosen = rolesChoosen.filter(roleChoosen => roleChoosen.sortId === role.sortId);
            const roleDisplay = { ...role };
            roleDisplay.premium = !(Array.isArray(roleAvailable) && roleAvailable.length > 0);
            roleDisplay.checked = Array.isArray(roleChoosen) && roleChoosen.length > 0
            roleDisplay.disabled = !this.props.isUserCreator;
            roles.push(roleDisplay);
        });

        const rolesMandatoryCpnt = rolesMandatory.map((role, i) => {
            return (
                <Col key={"rolesMandatory" + i} span={6} style={{ marginBottom: "20px" }}>
                    <Role checkbox={true} info={true} role={{ ...role, checked: true, disabled: true }} />
                </Col>
            )
        });

        const rolesAvailableCpnt = roles.map((role, i) => {
            return (
                <Col key={"rolesAvailable" + i} span={6} style={{ marginBottom: "20px" }}>
                    <Role checkbox={true} info={true} role={{ ...role }} onChange={() => this.onRoleCliked(i)} />
                </Col>
            )
        });

        return (
            <>
                <Row align="middle" style={{ marginBottom: "15px" }}>
                    <h4 style={{ marginBottom: "15px" }}>{this.props.t('lobbyGame_tabGameRulesRoleMandatory')}</h4>
                </Row>
                <Row>
                    {rolesMandatoryCpnt}
                </Row>
                <Row align="middle" style={{ marginBottom: "15px" }}>
                    <h4 style={{ marginBottom: "15px" }}>{this.props.t('lobbyGame_tabGameRulesOtherRoles')}</h4>
                </Row>
                <Row>
                    {rolesAvailableCpnt}
                </Row>
            </>
        );
    }
}

export default withTranslation()(RoleSection);

