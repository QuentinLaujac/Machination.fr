import React from "react";

import { connect } from 'react-redux';
import { gameJoined, sendMessage, updateGameRules, sendAction, actionProcessed } from '../../../actions/game';
import { withTranslation } from 'react-i18next'
import { history } from '../../../routers/AppRouter';

import { Col, Row, Tabs, Progress, Button } from 'antd';
import { MessageOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';

import { StickyContainer, Sticky } from 'react-sticky';

import Chat from './../../elements/chatCpnt/Chat';

import './LobbyGamePage.css';

import CharactersSection from './../../elements/charactersSection';
import GameRulesSection from './../../elements/gameRulesSection/GameRulesSection';
import StepStatus from '../../elements/stepStatus/StepStatus';

import LoadingPage from '../loadingPage/LoadingPage';


const { TabPane } = Tabs;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
    )}
  </Sticky>
);

const RenderNumberPlayerBeforeStart = (props) => {
  return (
    <div className="NumberPlayerBeforeStart">
      <Row align="middle">
        <Progress width={40} strokeColor="#4fc18a" type="circle" format={percent => props.players.length + " / " + (props.nbRolesChoosen + props.rolesMandatory.length)} percent={(props.players.length / (props.nbRolesChoosen + props.rolesMandatory.length)) * 100} />
        <span className="title">{props.t('lobbyGame_numberPlayerBeforeStart')}</span>
      </Row>
    </div>
  );
}

const GameHomeButton = (props) => {
  return (
    <div className="gameHomeButton" onClick={() => { props.onQuit() }}>
      <Row align="middle">
        <Button type="primary" shape="circle" icon={<HomeOutlined />} />
        <span className="title">{props.t('lobbyGame_goHome')}</span>
      </Row>
    </div>
  );
}


class LobbyGamePage extends React.Component {

  constructor(props) {
    super(props);
    this.gameId = this.props.id
    this.state = {
      nbRolesChoosen: this.props.rolesChoosen.length,
      showCountDown: false
    };
  }

  componentDidMount = () => {
    this.props.dispatchGameJoined(this.gameId);
  }


  componentDidUpdate(prevProps) {
    //If we have joined the party
    if (this.props.players.length > 0 && !this.hasAlreadyDispatchReady) {
      this.hasAlreadyDispatchReady = true;
      this.props.dispatchSendActionNext();
    }
    //

    //If we have some actions to processed
    if (prevProps.actionToProcessed.length === 0 && this.props.actionToProcessed.length > 0) {
      this.processedActions();
    }
    //

    if (prevProps.gameInfos.rolesChoosen !== this.props.gameInfos.rolesChoosen) {
      this.setState({ nbRolesChoosen: this.props.rolesChoosen.length });
    }
  }

  onGameRuleNeedUpdate = (rolesChoosen) => {
    const gameRulesToUpdate = {};
    gameRulesToUpdate.numberPlayerToStart = rolesChoosen.length + this.props.rolesMandatory.length;
    gameRulesToUpdate.rolesChoosen = JSON.stringify(rolesChoosen);
    //Prevents spamming database
    clearTimeout(this.dispatchUpdateGameRulesTimeout);
    this.dispatchUpdateGameRulesTimeout = setTimeout(() => this.props.dispatchUpdateGameRules(gameRulesToUpdate), 500);
    //
    this.setState({ nbRolesChoosen: rolesChoosen.length });
  }

  processedActions = () => {
    this.props.actionToProcessed.forEach(actionToProcessed => {
      if (actionToProcessed.name === "GAME_INIT") {
        this.setState({ showCountDown: true, durationCountDown: actionToProcessed.duration })
        this.props.dispatchActionProcessed();
      }
      else if (actionToProcessed.name === "CANCEL_GAME_INIT") {
        this.setState({ showCountDown: false })
        this.props.dispatchActionProcessed();
      }
    })
  }

  onQuit = () => {
    history.push({ pathname: '/lobby' })
  }

  onGameReadyToStart = () => {
    this.props.dispatchSendActionNext();
  }

  render() {
    if (this.props.players.length === 0) {
      return (<LoadingPage />);
    }
    return (
      <div className="gameLobby">
        <GameHomeButton t={this.props.t} onQuit={this.onQuit} />
        <Row>
          <Col xs={{ span: 8, offset: 1 }} sm={{ span: 12, offset: 1 }} md={{ span: 10, offset: 1 }} lg={{ span: 12, offset: 2 }} xl={{ span: 16, offset: 2 }}>
            <Row style={{ height: "100%", align: "center" }} align="middle">
              <CharactersSection onCharacterClick={() => { }} playerList={this.props.players} />
              {this.state.showCountDown ?
                (<StepStatus onCountDownDone={this.onGameReadyToStart} stepName={"GAME_INIT"} duration={this.state.durationCountDown} />) :
                (<RenderNumberPlayerBeforeStart t={this.props.t} players={this.props.players} nbRolesChoosen={this.state.nbRolesChoosen} rolesMandatory={this.props.rolesMandatory} />)}
            </Row>
          </Col>
          <Col xs={{ span: 15 }} sm={{ span: 11 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 6 }} >
            <div className="paramGameMenu">
              <StickyContainer>
                <Tabs defaultActiveKey={this.props.user.userId === this.props.gameInfos.creator ? "2" : "1"} size={"large"} renderTabBar={renderTabBar}>
                  <TabPane tab={
                    <span className="tabTitle">
                      <MessageOutlined />
                      {this.props.t('lobbyGame_tabMessagesTitle')}
                    </span>
                  } key="1">
                    <Chat user={this.props.user} dispatchSendMessage={this.props.dispatchSendMessage} generalMessages={this.props.generalMessages} />
                  </TabPane>
                  <TabPane tab={
                    <span className="tabTitle">
                      <SettingOutlined />
                      {this.props.t('lobbyGame_tabGameRulesTitle')}
                    </span>
                  } key="2">
                    <GameRulesSection
                      onGameRuleNeedUpdate={this.onGameRuleNeedUpdate}
                      isUserCreator={this.props.user.userId === this.props.gameInfos.creator}
                      numberMinPlayer={this.props.gameInfos.numberMinPlayer}
                      numberMaxPlayer={this.props.gameInfos.numberMaxPlayer}
                      rolesAvailable={this.props.rolesAvailable}
                      rolesList={this.props.rolesList}
                      rolesChoosen={this.props.rolesChoosen}
                      rolesMandatory={this.props.rolesMandatory} />
                  </TabPane>
                </Tabs>
              </StickyContainer>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const generalMessages = Object.assign([], state.game.generalMessages);
  const gameInfos = Object.assign({}, state.game.gameInfos);
  const players = Object.assign([], state.game.players);
  const rolesAvailable = gameInfos.rolesAvailable ? JSON.parse(gameInfos.rolesAvailable) : [];
  const rolesList = gameInfos.rolesList ? JSON.parse(gameInfos.rolesList) : [];
  const rolesChoosen = gameInfos.rolesChoosen ? JSON.parse(gameInfos.rolesChoosen) : [];
  const rolesMandatory = gameInfos.rolesMandatory ? JSON.parse(gameInfos.rolesMandatory) : [];
  return ({
    generalMessages: generalMessages,
    gameInfos: gameInfos,
    players: players,
    rolesAvailable: rolesAvailable,
    rolesList: rolesList,
    rolesChoosen: rolesChoosen,
    rolesMandatory: rolesMandatory,
    actionToProcessed: state.game.gameActionToProcessed
  });
}

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateGameRules: (gameInfos) => dispatch(updateGameRules(gameInfos)),
  dispatchGameJoined: (gameId) => dispatch(gameJoined(gameId)),
  dispatchSendMessage: (message, receiver) => dispatch(sendMessage(message, receiver)),
  dispatchSendActionNext: () => dispatch(sendAction("NEXT")),
  dispatchActionProcessed: () => dispatch(actionProcessed())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LobbyGamePage));
