import React from "react";
import './actionModal.css';
import { withTranslation } from 'react-i18next'
import Role from "../role/Role";
import AskInput from '../askInput/AskInput';
import roles_fr from '../../../assets/translations/role/roles_fr.json';
import CharactersSection from './../charactersSection';
import SortableRoles from './../sortableRoles/SortableRoles';

import { Modal, Row, Col, Button, Divider, Table } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const RoleContent = ({ roleName }) => {
    return (
        <Row>
            <Col span={8}>
                <Role role={{ role: roleName, checked: true }} info={false} />
            </Col>
            <Col span={16}>
                {roles_fr[roleName].p.map((paragraph, i) => (<p className="msg-wrapper" key={"p" + roleName + i}>{paragraph}</p>))}
            </Col>
        </Row>
    )
}

const VoteGuiltyContent = ({ explanation }) => {
    return (
        <Row>
            <Col span={8}>
                <div style={{ backgroundColor: "black", width: " 100%" }}></div>
            </Col>
            <Col span={16}>
                <p className="msg-wrapper" >{explanation}</p>
            </Col>
        </Row>
    )
}

const RolePropositionContent = ({ explanation, players, roles, onOk, textSendButton }) => {

    let rolePlayers = [];

    const onSortRole = (rolePlayersSorted) => {
        rolePlayers = rolePlayersSorted;
    }

    return (
        <Row>
            <p>{explanation}</p>
            <Row>
                <CharactersSection hideCamera={true} hidePointer={true} hideVote={true} hideInfoWitness={true} onCharacterClick={() => { }} playerList={players} />
                <SortableRoles players={players} roles={roles} onSort={onSortRole} />
                <Divider className="dividerRoleProposition" />
                <Row className="rolePropositionRowSend">
                    <Col offset={18} span={6}>
                        <Button className="sendRolePropositionButton button" htmlType="submit" type="primary" onClick={() => { onOk(rolePlayers) }}> {textSendButton} <SendOutlined /></Button>
                    </Col>
                </Row>
            </Row>
        </Row>
    )
}

const WitnessAnswer = ({ t, onOk }) => {
    return (
        <div className="row">
            <Button className="button yesyes" htmlType="submit" type="primary" onClick={() => { onOk("actionModal_aswerWitnessYesYes") }}>
                {t('actionModal_aswerWitnessYesYes')}
            </Button>
            <Button className="button yes" htmlType="submit" type="primary" onClick={() => { onOk("actionModal_aswerWitnessYes") }}>
                {t('actionModal_aswerWitnessYes')}
            </Button>
            <Button className="button yesNeitherNo" htmlType="submit" type="primary" onClick={() => { onOk("actionModal_aswerWitnessYesNeitherNo") }}>
                {t('actionModal_aswerWitnessYesNeitherNo')}
            </Button>
            <Button className="button dontKnow" htmlType="submit" type="primary" onClick={() => { onOk("actionModal_aswerWitnessDontKnow") }}>
                {t('actionModal_aswerWitnessDontKnow')}
            </Button>
            <Button className="button no" htmlType="submit" type="primary" onClick={() => { onOk("actionModal_aswerWitnessNo") }}>
                {t('actionModal_aswerWitnessNo')}
            </Button>
            <Button className="button nono" htmlType="submit" type="primary" onClick={() => { onOk("actionModal_aswerWitnessNoNo") }}>
                {t('actionModal_aswerWitnessNoNo')}
            </Button>
        </div>
    )
}

const RoundResultContent = ({ t, roundResult }) => {

    const columns = [
        {
            title: t('actionModal_showResult_tableName'),
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 60
        },
        {
            title: t('actionModal_showResult_points'),
            dataIndex: 'points',
            key: 'points',
            align: 'center',
            width: 60,
        },
        {
            title: t('actionModal_showResult_detailPoints'),
            dataIndex: 'detailPoints',
            key: 'detailPoints',
            align: 'center',
            width: 283,
            render: detailPoints => Object.keys(detailPoints).map(detail => (<p className="detailPoints">{`${t(`detailPoints_${detail}`)} ${detailPoints[detail]} point(s)`}</p>))
        },
        {
            title: t('actionModal_showResult_role'),
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            width: 120,
            render: roleName => <div className="roleResult"><div className="roleDiv"><Role role={{ role: roleName, checked: true }} info={true} /></div></div>
        },
    ];
    const dataSource = roundResult.map((result, i) => { return { key: i, name: result.username, points: result.points, detailPoints: result.detailPoints, role: result.roleName } });

    return (
        <Table pagination={false} dataSource={dataSource} columns={columns} />
    )
}


const GameResultContent = ({ t, results }) => {

    const columns = [
        {
            title: t('actionModal_showResult_rank'),
            dataIndex: 'rank',
            key: 'rank',
            align: 'rank',
            width: 112
        },
        {
            title: t('actionModal_showResult_tableName'),
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 112
        },
        {
            title: t('actionModal_showResult_points'),
            dataIndex: 'points',
            key: 'points',
            align: 'center',
            width: 112,
        },
        {
            title: t('actionModal_showResult_xp'),
            dataIndex: 'xp',
            key: 'xp',
            align: 'center',
            width: 112
        },
    ];
    const dataSource = results.map((result, i) => {
        return {
            key: i, rank: i + 1, name: result.username, points: result.points, xp: "+450 Xp"
        }
    });

    return (
        <Table pagination={false} dataSource={dataSource} columns={columns} />
    )
}

class ActionModal extends React.Component {

    render() {
        let title = "";
        let content = (<></>);
        let maskClosable = true;
        let closable = true;
        let footer = null;
        if (this.props.action) {
            switch (this.props.action.name) {
                case "ROLE_ALLOCATION":
                    title = `${this.props.t('actionModal_roleTitle')} : ${roles_fr[this.props.action.roleName].title}`;
                    content = (<RoleContent roleName={this.props.action.roleName} />);
                    break;
                case "YOUR_TURN_INTERROGATION":
                    maskClosable = false;
                    closable = false;
                    title = this.props.t('actionModal_interrogation')
                    content = (<AskInput onSubmit={(value) => this.props.onOk({ sendName: "ASK_WIKNESS", action: this.props.action, data: value })} placeholder={this.props.t('actionModal_interrogation')} icon={(<SendOutlined />)} />);
                    break;
                case "YOUR_TURN_INTERROGATION_PHASE2":
                    maskClosable = false;
                    closable = false;
                    title = this.props.t('actionModal_interrogation')
                    content = (<AskInput onSubmit={(value) => this.props.onOk({ sendName: "ASK_WIKNESS", action: this.props.action, data: value })} placeholder={this.props.t('actionModal_interrogation')} icon={(<SendOutlined />)} />);
                    break;
                case "QUESTION_WITNESS":
                    maskClosable = false;
                    closable = false;
                    title = (<div className="titleQuestion"><span className="sender">{`${this.props.action.senderName}, ${this.props.t('actionModal_titleQuestion')} :`}</span> <span className="question">{this.props.action.question}</span></div>)
                    content = (<WitnessAnswer t={this.props.t} onOk={(answer) => { this.props.onOk({ sendName: "WITNESS_ANSWER", action: this.props.action, data: { senderName: this.props.action.senderName, questionId: this.props.action.questionId, question: this.props.action.question, answer: answer } }) }} />);
                    break;
                case "SHOW_WITNESS":
                    title = `${this.props.action.player.username} ${this.props.t('actionModal_isWitness')}`;
                    content = (<RoleContent roleName={"WITNESS"} />);
                    break;
                case "SHOW_EVIDENCE":
                    title = `${this.props.t('gamePage_profilSectionEvidence')}`;
                    content = (<div className="showCrimeElement"><span>{this.props.action.evidence.evidence_fr}</span></div>);
                    break;
                case "VOTE_GUILTY":
                    title = `${this.props.t('actionModal_voteGuiltyTitle')}`;
                    content = (<VoteGuiltyContent explanation={this.props.t('actionModal_voteGuiltyContent')} className="showCrimeElement" />);
                    break;
                case "YOUR_ROLE_PROPOSITION":
                    maskClosable = false;
                    closable = false;
                    title = `${this.props.t('actionModal_rolePropositionTitle')}`;
                    content = (<RolePropositionContent textSendButton={this.props.t('actionModal_send')} onOk={(rolePlayers => this.props.onOk({ sendName: "ROLE_PROPOSITION", action: this.props.action, data: { rolePlayers: rolePlayers } }))} roles={[...JSON.parse(this.props.gameInfos.rolesChoosen), ...JSON.parse(this.props.gameInfos.rolesMandatory)]} explanation={this.props.t('actionModal_rolePropositionContent')} players={this.props.players} className="showCrimeElement" />);
                    break;
                case "PLAYER_FIND_CRIME_ELEMENT":
                    title = `${this.props.t('stepStatus_PLAYER_FIND_CRIME_ELEMENT')}`;
                    content = (<div className="showCrimeElement"><span>{this.props.action.username}{this.props.t('PLAYER_FIND_CRIME_ELEMENT')}{` "${this.props.action.crimeElement}"`}</span></div>);
                    break;
                case "SHOW_RESULTS":
                    maskClosable = false;
                    closable = false;
                    title = `${this.props.t('actionModal_showRoundResult')}`;
                    content = (<RoundResultContent t={this.props.t} roundResult={JSON.parse(this.props.action.roundResult)} className="showCrimeElement" />);
                    break;
                case "SHOW_RESULTS_FINAL":
                    maskClosable = false;
                    closable = false;
                    title = `${this.props.t('actionModal_showResult')}`;
                    content = (<GameResultContent t={this.props.t} results={JSON.parse(this.props.action.results)} className="showCrimeElement" />);
                    break;
                default:
                    break;
            }
        }

        return (
            <Modal
                title={title}
                visible={this.props.visible}
                wrapClassName={"actionModal"}
                centered={true}
                footer={footer}
                mask={false}
                maskClosable={maskClosable}
                zIndex={1}
                width={"585px"}
                closable={closable}
                onCancel={this.props.onCancel}
            >
                {content}
            </Modal>
        );
    }
}

export default withTranslation()(ActionModal);

