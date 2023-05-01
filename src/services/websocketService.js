import appConfig from "../config.api.js";
import { playerJoined, playerLeft, gotRefreshGameData, receiveMessage, messageSent, gameRulesUpdated, actionSent, actionToProcessed, receiveEventMessage } from '../actions/game';

import * as errorTypes from '../errors/errorTypes';
import modalConnectionError from '../components/elements/ModalConnectionError';

const host = appConfig.WS_HOST;

const enumWebsocket = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};


class WebsocketService {

  game = { gameId: null };
  user = null;
  socket = null;
  messageToSend = null;

  constructor(store) {
    this.store = store;
    this.store.subscribe(this.listener);
  }


  listener = () => {
    let state = this.store.getState();

    //If we join a game
    this.user = Object.assign({}, state.auth.user);
    if (state.game.gameInfos.gameId && this.game.gameId !== state.game.gameInfos.gameId) {
      this.game.gameId = state.game.gameInfos.gameId;
      return this.createSocketConnection(this.user, this.game.gameId);
    }

    //If we quit a game
    if (Object.keys(state.game.gameInfos).length === 0 && this.socket && this.socket.readyState === enumWebsocket.OPEN) {
      return this.socket.close();
    }

    //If we have a message to send
    const messagesToSend = Object.assign([], state.game.messageToSend);
    const messageToSend = messagesToSend.shift();
    if (messageToSend && this.messageToSend == null) {
      this.messageToSend = messageToSend;
      return this.sendMessage(messageToSend);
    }

    //If we need to upadte game rules
    const gameInfosToUpdate = Object.assign([], state.game.gameInfosToUpdate);
    const gameInfosUpdate = gameInfosToUpdate.shift();
    if (gameInfosUpdate) {
      return this.updateGameInfos(gameInfosUpdate);
    }

    //If we have an action to send
    const gameActionsToSend = Object.assign([], state.game.gameActionToSend);
    const gameActionToSend = gameActionsToSend.shift();
    if (gameActionToSend) {
      return this.sendGameAction(gameActionToSend);
    }
  }

  createSocketConnection = (user, gameId) => {
    try {
      this.socket = new WebSocket(`${host}?gameId=${gameId}&Authorizer=${user.tokenId}`);
    } catch (err) {
      modalConnectionError(errorTypes.UNABLE_TO_INITIALIZE_SOCKET);
      return console.error('Unable to initialize socket connection', err.toString());
    }
    this.socket.onopen = this.onSocketOpened;
    this.socket.onerror = this.onSocketError;
    this.socket.onclose = this.onSocketClosed;
    this.socket.onmessage = this.onmessage;
  }

  onSocketOpened = (e) => {
    this.ping();
    this.fetchDataGame();
  }

  onSocketClosed = (event) => {
    let state = this.store.getState();
    //If we are in game
    if (Object.keys(state.game.gameInfos).length > 1) {
      modalConnectionError(errorTypes.LOST_CONNECTION);
    }
    //
    this.game = { gameId: null };
    console.log(`[close] Connection closed, code=${event.code} reason=${event.reason}`);
  };

  onSocketError = (error) => {
    console.error('Error during connection', error);
    this.socket.close();
  };

  onmessage = (event) => {
    const content = JSON.parse(event.data);
    console.log("receive ", content.action);
    console.log("with data ", content.value);
    switch (content.action) {
      case 'PING':
        console.log('Keeping socket alive');
        break;
      case 'EVENT_PLAYER_JOIN':
        this.store.dispatch(playerJoined(content.value));
        break;
      case 'EVENT_PLAYER_LEFT':
        this.store.dispatch(playerLeft(content.value));
        break;
      case 'REFRESH_GAME_DATA':
        this.store.dispatch(gotRefreshGameData(content.value));
        break;
      case 'ERROR_REFRESH_GAME_DATA':
        //If we have an error refresh game data it's because the game join service doesn't have saved our player yet 
        setTimeout(this.fetchDataGame, 5000); //wait 5 seconds and retry
        break;
      case 'GAME_SEND_MESSAGE':
        this.store.dispatch(receiveMessage(content.value));
        break;
      case 'GAME_RECEIVE_EVENT_MESSAGE':
        this.store.dispatch(receiveEventMessage(content.value));
        break;
      case 'GAME_ACTION':
        console.log("receive action", { ...content.value, ...{ name: content.type } });
        this.store.dispatch(actionToProcessed({ ...content.value, ...{ name: content.type } }));
        break;
      case 'DATA':
        console.log(content.value);
        break;
      default:
        console.error('Unsupported response', content);
    }
  };

  // Websockets usually timeout and close automatically after being
  // idle for around a minute. This ping/pong implementation keeps
  // the socket alive.
  ping = () => {
    if (this.socket.readyState === enumWebsocket.OPEN) {
      const pingMessage = {
        action: 'PING'
      };
      this.socket.send(JSON.stringify(pingMessage));
      setTimeout(this.ping, 30000);
    }
  };

  fetchDataGame = () => {
    const fetchDataMessage = {
      action: 'GAME',
      type: 'FETCH_DATA_GAME'
    };
    this.socket.send(JSON.stringify(fetchDataMessage));
  }

  sendMessage = (message) => {
    if (this.socket.readyState === enumWebsocket.OPEN) {
      const messageFormat = {
        action: 'GAME',
        type: 'MESSAGE',
        message: {
          receiver: message.receiver,
          content: message.content
        }
      };
      this.socket.send(JSON.stringify(messageFormat));
      this.messageToSend = null;
      this.store.dispatch(messageSent());
    }
  };

  updateGameInfos = (gameInfos) => {
    if (this.socket.readyState === enumWebsocket.OPEN) {
      const messageFormat = {
        action: 'GAME',
        type: 'UPDATE_GAME_RULES',
        message: {
          gameInfos: gameInfos,
        }
      };
      this.socket.send(JSON.stringify(messageFormat));
      this.store.dispatch(gameRulesUpdated());
    }
  };

  sendGameAction = (gameActionToSend) => {
    if (this.socket.readyState === enumWebsocket.OPEN) {
      const messageFormat = {
        action: 'GAME',
        type: 'GAME_ACTION',
        message: {
          gameAction: gameActionToSend,
        }
      };
      this.socket.send(JSON.stringify(messageFormat));
      this.store.dispatch(actionSent());
    }
  }

}

export default WebsocketService;
