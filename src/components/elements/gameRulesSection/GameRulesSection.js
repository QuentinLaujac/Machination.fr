import React from "react";
import './gameRulesSection.css';
import { Row, Slider, Typography, message } from 'antd';
import RoleSection from './../RoleSection';
import { withTranslation } from 'react-i18next'

const { Title } = Typography;

class GameRulesSection extends React.Component {

    lastNbPlayerInGameValue = null;

    onRoleCliked = (roleClicked) => {

        const rolesChoosen = Object.assign([], this.state.rolesChoosen);
        const indexOfRoleToDelete = rolesChoosen.findIndex(role => { return role.sortId === roleClicked.sortId })
        if (indexOfRoleToDelete === -1) {
            rolesChoosen.push(roleClicked);
        } else {
            rolesChoosen.splice(indexOfRoleToDelete, 1);
        }

        if ((rolesChoosen.length + this.state.rolesMandatory.length) > this.props.numberMaxPlayer) {
            return message.error(this.props.t('GameRulesSection_maxNbRolesAchieve'));
        }
        if ((rolesChoosen.length + this.state.rolesMandatory.length) < this.props.numberMinPlayer) {
            return message.error(this.props.t('GameRulesSection_cannotLessRole'));
        }
        this.lastNbPlayerInGameValue = null;//Data base spam prevention with the slider
        this.props.onGameRuleNeedUpdate(rolesChoosen);
        this.setState({ rolesChoosen: rolesChoosen });
    }

    onSliderChange = value => {
        const rolesChoosen = Object.assign([], this.state.rolesChoosen);

        while (value < (rolesChoosen.length + this.state.rolesMandatory.length)) {
            rolesChoosen.pop();
        }
        while (value > (rolesChoosen.length + this.state.rolesMandatory.length)) {
            this.state.rolesAvailable.forEach(roleAvailable => {
                if (value <= (rolesChoosen.length + this.state.rolesMandatory.length)) {
                    return;
                }
                const indexRoleToAdd = rolesChoosen.findIndex(role => { return role.sortId === roleAvailable.sortId })
                if (indexRoleToAdd === -1) {
                    return rolesChoosen.push(roleAvailable);
                }
            });
        }

        if ((rolesChoosen.length + this.state.rolesMandatory.length) > this.props.numberMaxPlayer) {
            return message.error(this.props.t('GameRulesSection_maxNbRolesAchieve'));
        }
        if ((rolesChoosen.length + this.state.rolesMandatory.length) < this.props.numberMinPlayer) {
            return message.error(this.props.t('GameRulesSection_cannotLessRole'));
        }

        this.props.onGameRuleNeedUpdate(rolesChoosen);
        this.setState({ rolesChoosen: rolesChoosen });
    };

    constructor(props) {
        super(props);
        this.state = {
            rolesAvailable: this.props.rolesAvailable,
            rolesList: this.props.rolesList,
            rolesChoosen: this.props.rolesChoosen,
            rolesMandatory: this.props.rolesMandatory,
        };
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.rolesAvailable) !== JSON.stringify(this.props.rolesAvailable) ||
            JSON.stringify(prevProps.rolesList) !== JSON.stringify(this.props.rolesList) ||
            JSON.stringify(prevProps.rolesChoosen) !== JSON.stringify(this.props.rolesChoosen) ||
            JSON.stringify(prevProps.rolesMandatory) !== JSON.stringify(this.props.rolesMandatory)) {
            this.setState({
                rolesAvailable: this.props.rolesAvailable,
                rolesList: this.props.rolesList,
                rolesChoosen: this.props.rolesChoosen,
                rolesMandatory: this.props.rolesMandatory,
            });
        }
    }

    render() {
        return (
            <div className="gameRulesSection">
                <Row className="rulesRow" align="middle">
                    <Title className="ruleTitle" level={4}>{this.props.t('lobbyGame_tabGameRulesNbPlayer')}</Title>
                    <Slider style={{ width: "80%", marginLeft: "10%" }} disabled={!this.props.isUserCreator} min={this.props.numberMinPlayer} max={this.props.numberMaxPlayer} onAfterChange={this.afterSliderChanged} onChange={this.onSliderChange} value={this.state.rolesChoosen.length + this.state.rolesMandatory.length} tooltipVisible />
                </Row>
                <Row className="rulesRow composition" align="middle">
                    <Row align="middle">
                        <Title style={{ marginBottom: "20px" }} level={4}>{this.props.t('lobbyGame_tabGameRulesComposition')}</Title>
                    </Row>
                    <Row align="middle">
                        <RoleSection isUserCreator={this.props.isUserCreator} onRoleCliked={this.onRoleCliked} rolesAvailable={this.state.rolesAvailable} rolesList={this.state.rolesList} rolesMandatory={this.state.rolesMandatory} rolesChoosen={this.state.rolesChoosen} />
                    </Row>
                </Row>
            </div>
        );
    }
}

export default withTranslation()(GameRulesSection);

