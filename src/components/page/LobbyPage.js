import React from "react";
import { List, Col, Avatar, Row, Button, Tag, Statistic, message } from 'antd';
import { withTranslation } from 'react-i18next'
import tate_img from "../../assets/img/character/tate.png";

import HttpService from '../../services/httpService';
import { history } from '../../routers/AppRouter';

const intialState = {
  loading: false,
  data: [{
    id: "data1",
    name: "Uthar",
    partyId: "0x65sqdf321",
    roles: [
      "sergent",
      "Mafieux",
      "Indic",
    ],
    numberPlayer: 4,
    maxPlayer: 5,
  },
  {
    id: "data2",
    name: "Rouch69",
    partyId: "0x65sqdd681",
    roles: [
      "sergent",
      "Detective",
      "Complice",
      "Bookmaker"
    ],
    numberPlayer: 5,
    maxPlayer: 8,
  }]
}

class LobbyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = intialState;
  }

  createGame = async () => {
    let gameCreated = null;
    try {
      this.setState({ loading: true });
      gameCreated = await HttpService.createGame(this.props.user);
    } catch (err) {
      console.error(err);
      return message.error('Unable to create a game');
    } finally {
      this.setState({ loading: false });
    }
    message.success('Game created');

    return history.push({ pathname: '/game/' + gameCreated.data.gameId, state: { game: gameCreated.data } });
  };

  render() {
    return (
      <section className="fog">
        <div className="lobbyBackground">
          <div className="fog__container">
            <div className="fog__img fog__img--first"></div>
            <div className="fog__img fog__img--second"></div>
          </div>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 18 }} md={{ span: 12 }} lg={{ span: 10, offset: 3 }} xl={{ span: 8, offset: 3 }} >
              <Row style={{ marginTop: "20%", marginBottom: "20px" }}>
                <Col span={15}>
                  <Button size="large" type="primary" shape="round" className="playButton" >
                    {this.props.t('lobbyPage_play')}
                  </Button>
                </Col>
                <Col span={8} offset={1}>
                  <Button size="large" type="primary" shape="round" className="createGameButton" onClick={() => { this.createGame() }} loading={this.state.loading}>
                    {this.props.t('lobbyPage_createGame')}
                  </Button>
                </Col>
              </Row>
              <Row>
                <List
                  className="gameList"
                  dataSource={this.state.data}
                  renderItem={item => (
                    <List.Item className="gameItem" key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Avatar className="gameAvatar" size={64}>{item.name}</Avatar>
                        }
                        title={<a href="https://ant.design">{item.partyId}</a>}
                        description={item.roles.map(role => (<Tag key={role} className="roleTag" color={role}>{role}</Tag>))}
                      />
                      <Statistic className="playerNumber" value={item.numberPlayer} suffix={"/ " + item.maxPlayer} />
                    </List.Item>
                  )}
                >
                </List>
              </Row>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 12 }} lg={{ span: 4, offset: 3 }} xl={{ span: 4, offset: 3 }} className="avatarPreviewBox">
              <img src={tate_img} alt="character" className="character" />
            </Col>
          </Row>
        </div>

      </section>
    );
  }
}


export default withTranslation()(LobbyPage);
