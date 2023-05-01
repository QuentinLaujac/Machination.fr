import React from "react";

import { connect } from 'react-redux';
import { sendMessage, sendAction, actionProcessed, receiveRolePlayer, knowWitness, knowEvidence, addWitnessQuestion, witnessQuestionProcessed } from '../../../actions/game';
import { withTranslation } from 'react-i18next'

import { Col, Row, Divider, Typography, message } from 'antd';
import { AimOutlined } from '@ant-design/icons';

import Chat from '../../elements/chatCpnt/Chat';
import AskInput from '../../elements/askInput/AskInput';
import StepStatus from '../../elements/stepStatus/StepStatus';
import ActionModal from '../../elements/actionModal/ActionModal';

import './GamePage.css';

import CharactersSection from '../../elements/charactersSection';
import Role from "../../elements/role/Role";

const { Title } = Typography;

const AskCrimeElement = ({ onSubmit, placeholder, disabled, roleName, canAskCrimeElement }) => {
  if (!canAskCrimeElement || roleName === undefined || roleName === "WITNESS" || roleName === "GUILTY") {
    return (<></>);
  }
  return (
    <div className="AskCrimeElement">
      <div className="input">
        <AskInput disabled={disabled} loading={disabled} onSubmit={onSubmit} placeholder={placeholder} icon={(<AimOutlined />)} />
      </div>
    </div>
  );
}

class GamePage extends React.Component {

  state = {
    displayActionModal: false,
    actionForActionModal: undefined,
    keyStep: 0 //force remounting stepStatus component
  }


  componentDidMount = () => {
    if (this.props.gameInfos.stepDuration && this.props.rolePlayer.roleName) {
      if (this.props.gameInfos.stepName === "PLAYER_FIND_CRIME_ELEMENT") {
        this.setState({
          displayActionModal: true,
          actionForActionModal: { name: this.props.gameInfos.stepName }
        });
      }
      else if (this.props.gameInfos.stepName === "SHOW_RESULTS") {
        this.setState({
          displayActionModal: true,
          actionForActionModal: { name: this.props.gameInfos.stepName, roundResult: this.props.gameInfos.roundResult }
        });
      }
      else if (this.props.gameInfos.stepName === "SHOW_RESULTS_FINAL") {
        this.setState({
          displayActionModal: true,
          actionForActionModal: { name: this.props.gameInfos.stepName, results: this.props.gameInfos.results }
        });
      }
      else if (this.props.rolePlayer.roleName !== "WITNESS" && (this.props.gameInfos.stepName === "YOUR_TURN_INTERROGATION" || this.props.gameInfos.stepName === "YOUR_TURN_INTERROGATION_PHASE2")) {
        this.setState({
          displayActionModal: true,
          actionForActionModal: { name: this.props.gameInfos.stepName }
        });
      } else if (this.props.rolePlayer.roleName === "INSPECTOR" && this.props.gameInfos.stepName === "ROLE_PROPOSITION") {
        this.setState({
          displayActionModal: true,
          actionForActionModal: { name: "YOUR_ROLE_PROPOSITION" }
        });
      }
    }

    if (this.props.actionToProcessed.length > 0) {
      this.processedActions();
    }

    if (this.props.witnessQuestion.length > 0) {
      this.processedWitnessQuestion();
    }

    this.props.dispatchActionData("NEXT");
  }

  componentDidUpdate(prevProps) {
    //If we have some actions to processed
    if (prevProps.actionToProcessed.length !== this.props.actionToProcessed.length) {
      this.processedActions();
    }
    //

    //If we have to answer questions
    if (prevProps.witnessQuestion.length !== this.props.witnessQuestion.length) {
      this.processedWitnessQuestion();
    }
    //
  }

  componentWillUnmount = () => {
    clearTimeout(this.timeoutActionModal);
    clearTimeout(this.timeoutProposeCrimeElement);
    clearTimeout(this.timeoutMessage);
  }

  processedActions = () => {
    let stateToUpdate = { ...this.state };
    this.props.actionToProcessed.forEach(actionToProcessed => {
      let hideInStepStatus = false;
      switch (actionToProcessed.name) {
        case "ROLE_ALLOCATION":
          this.props.dispatchReceiveRolePlayer({ roleName: actionToProcessed.roleName, guiltyUserId: actionToProcessed.guiltyUserId, powerUsed: actionToProcessed.powerUsed, points: actionToProcessed.points, round: actionToProcessed.round });
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          break;
        case "SHOW_WITNESS":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          this.props.dispatchKnowWitness(actionToProcessed.player);
          break;
        case "SHOW_EVIDENCE":
          if (actionToProcessed.evidence) {
            stateToUpdate = {
              ...stateToUpdate,
              displayActionModal: true,
              actionForActionModal: actionToProcessed,
              keyStep: this.state.keyStep + 1
            };
          }
          this.props.dispatchKnowEvidence(actionToProcessed.evidence, actionToProcessed.evidence_type);
          break;
        case "YOUR_TURN_INTERROGATION":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1

          };
          break;
        case "YOUR_TURN_INTERROGATION_PHASE2":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed
          };
          if (this.props.rolePlayer.roleName === "WITNESS") {
            stateToUpdate = {
              ...stateToUpdate,
              keyStep: this.state.keyStep + 1
            }
          }
          break;
        case "VOTE_GUILTY":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          break;
        case "YOUR_ROLE_PROPOSITION":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          break;
        case "PLAYER_FIND_CRIME_ELEMENT":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          break;
        case "SHOW_RESULTS":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          break;
        case "SHOW_RESULTS_FINAL":
          stateToUpdate = {
            ...stateToUpdate,
            displayActionModal: true,
            actionForActionModal: actionToProcessed,
            keyStep: this.state.keyStep + 1
          };
          break;
        case "QUESTION_WITNESS":
          hideInStepStatus = true;
          this.props.dispatchAddWitnessQuestion(actionToProcessed);
          break;
        case "WRONG_CRIME_ELEMENT":
          hideInStepStatus = true;
          message.error({
            content: this.props.t('gamePage_wrongCrimeElementMsg'),
            className: 'messageAction',
          });
          this.timeoutMessage = setTimeout(() => message.error({
            content: `${actionToProcessed.duration} ${this.props.t('gamePage_wrongCrimeElementDuration')}`,
            className: 'messageAction',
          }), 2000);
          this.timeoutProposeCrimeElement = setTimeout(() => { this.setState({ disableAskCrimeElement: false }) }, actionToProcessed.duration * 1000);
          break;
        default:
          stateToUpdate = {
            ...stateToUpdate,
            keyStep: this.state.keyStep + 1
          };
          this.onEndStep();
          break;
      }
      this.props.dispatchActionProcessed(hideInStepStatus);
    })
    stateToUpdate = {
      ...stateToUpdate,
    };
    this.setState(stateToUpdate);
  }

  processedWitnessQuestion = () => {
    if (this.props.witnessQuestion.length === 0) {
      return;
    }
    const witnessQuestion = this.props.witnessQuestion[0];
    this.setState({
      displayActionModal: true,
      actionForActionModal: { ...witnessQuestion, name: "QUESTION_WITNESS" },
    });
  }

  onEndStep = () => {
    this.setState({
      displayActionModal: false,
      actionForActionModal: undefined
    })
    this.props.dispatchActionData("NEXT");
  }

  actionModalOk = (data) => {
    if (data && data.action && data.action.name === "QUESTION_WITNESS") {
      //It's the time that the modal is made to prevent the next question from being displayed when it closes.
      this.timeoutActionModal = setTimeout(() => this.props.dispatchWitnessQuestionProcessed(), 300)
      //
    }

    this.props.dispatchActionData(data.sendName, data.data);

    if (data && data.action && data.action.name === "YOUR_TURN_INTERROGATION_PHASE2") {
      return;
    }

    this.onEndStep();
  }

  actionModalCancel = () => {
    this.setState({
      displayActionModal: false,
      actionForActionModal: undefined
    })
  }

  onCharacterClicked = (player) => {
    if (this.props.gameInfos.stepName === "VOTE_GUILTY") {
      this.props.dispatchActionData("VOTE_GUILTY", player);
      this.onEndStep();
    }
  }

  proposeCrimeElement = (crimeElement) => {
    this.props.dispatchActionData("PROPOSE_CRIME_ELEMENT", crimeElement);
    this.setState({ disableAskCrimeElement: true })
  }

  render() {
    return (
      <div className="gamePage">
        <ActionModal rolePlayer={this.props.rolePlayer} gameInfos={this.props.gameInfos} players={this.props.players} visible={this.state.displayActionModal} action={this.state.actionForActionModal} onOk={this.actionModalOk} onCancel={this.actionModalCancel} />
        <Row>
          <Row style={{ width: "100%" }}>
            <Col xs={{ span: 9 }} sm={{ span: 13 }} md={{ span: 11 }} lg={{ span: 14 }} xl={{ span: 18 }}>
              <StepStatus key={this.state.keyStep} onCountDownDone={this.onEndStep} stepName={this.props.gameInfos.stepName} duration={this.props.gameInfos.stepDuration} />
              <Row >
                <AskCrimeElement canAskCrimeElement={this.props.gameInfos.canAskCrimeElement} roleName={this.props.rolePlayer.roleName} show={this.props.gameInfos.canAskCrimeElement} disabled={this.state.disableAskCrimeElement} placeholder={this.props.t(`gamePage_placeHolderPropseCrimeElement_${this.props.rolePlayer.evidence_type}`)} onSubmit={this.proposeCrimeElement} />
              </Row>
            </Col>
          </Row>
          <Col xs={{ span: 8, offset: 1 }} sm={{ span: 12, offset: 1 }} md={{ span: 10, offset: 1 }} lg={{ span: 12, offset: 2 }} xl={{ span: 16, offset: 2 }}>
            <Row style={{ height: "100%", align: "center" }} align="middle">
              <CharactersSection onCharacterClick={this.onCharacterClicked} playerList={this.props.players} guiltyUserId={this.props.rolePlayer.guiltyUserId} />
            </Row>
          </Col>
          <Col xs={{ span: 15 }} sm={{ span: 11 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 6 }} >
            <div className="rightGameMenu">
              <Row className="gameStatusSection" >
                <Col xs={{ span: 8 }} sm={{ span: 8 }} md={{ span: 8 }} lg={{ span: 8 }} xl={{ span: 8 }} >
                  <div className="role">
                    <Role role={{ role: this.props.rolePlayer.roleName, checked: true }} info={!!this.props.rolePlayer.roleName} />
                  </div>
                </Col>
                <Col xs={{ span: 16 }} sm={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }} xl={{ span: 16 }} >
                  <Row className="InfosGame" align="middle" >
                    <Row className="InfosGame" align="middle" >
                      <Title className="ruleTitle" level={4}>{this.props.user.username}</Title>
                    </Row>
                    <Row className="InfosGame" align="middle" >
                      <Col span="10" style={{ marginTop: "3px" }}>
                        <Row className="InfosGame" style={{ textAlign: "left" }} align="middle" >
                          {
                            this.props.rolePlayer.round && this.props.rolePlayer.round === 3 ?
                              (
                                <h4 className="red">{this.props.t('gamePage_lastRound')}</h4>
                              ) :
                              (
                                <h4>{this.props.t('gamePage_profilSectionRoundNum')}: {this.props.rolePlayer.round ? this.props.rolePlayer.round : 1}</h4>
                              )
                          }
                        </Row>
                        <Row className="InfosGame" align="middle" >
                          <h4>{this.props.t('gamePage_profilSectionNbPoint')}: {this.props.rolePlayer.points ? this.props.rolePlayer.points : 0}</h4>
                        </Row>
                      </Col>
                      {this.props.rolePlayer.evidence_type ? (
                        <Col span="14">
                          <Row className="InfosGame" align="middle" >
                            <Row className="InfosGame">
                              <h4 style={{ textAlign: "center", width: "100%" }}>{this.props.t(`gamePage_profilSectionEvidenceType_${this.props.rolePlayer.evidence_type}`)}</h4>
                            </Row>
                            {this.props.rolePlayer.evidence_fr ?
                              (
                                <Row className="InfosGame">
                                  <span className="crimeElement">{this.props.rolePlayer.evidence_fr}</span>
                                </Row>
                              ) : (<></>)
                            }
                          </Row>
                        </Col>
                      ) : (<></>)}
                    </Row>
                  </Row>
                </Col>
                <Divider style={{ marginTop: "-15px" }} />
              </Row>
              <Chat user={this.props.user} dispatchSendMessage={this.props.dispatchSendMessage} generalMessages={this.props.generalMessages} height={230} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    generalMessages: Object.assign([], state.game.generalMessages),
    gameInfos: Object.assign({}, state.game.gameInfos),
    players: Object.assign([], state.game.players),
    rolePlayer: Object.assign({}, state.game.rolePlayer),
    actionToProcessed: Object.assign([], state.game.gameActionToProcessed),
    witnessQuestion: Object.assign([], state.game.witnessQuestion),
  });
}

const mapDispatchToProps = (dispatch) => ({
  dispatchSendMessage: (message, receiver) => dispatch(sendMessage(message, receiver)),
  dispatchActionProcessed: (skipInGameInfos) => dispatch(actionProcessed(skipInGameInfos)),
  dispatchActionData: (actionName, data) => dispatch(sendAction(actionName, data)),
  dispatchReceiveRolePlayer: (rolePlayer) => dispatch(receiveRolePlayer(rolePlayer)),
  dispatchKnowWitness: (witness) => dispatch(knowWitness(witness)),
  dispatchKnowEvidence: (evidence, evidence_type) => dispatch(knowEvidence(evidence, evidence_type)),
  dispatchAddWitnessQuestion: (witnessQuestion) => dispatch(addWitnessQuestion(witnessQuestion)),
  dispatchWitnessQuestionProcessed: () => dispatch(witnessQuestionProcessed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(GamePage));
