import React from 'react'

import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import { login, needToLogin } from '../actions/auth';
import AppRouter from '../routers/AppRouter';
import CognitoService from '../services/cognitoService';
import WebSocketService from '../services/websocketService';

import { message } from 'antd';


const store = configureStore();

export const websocket = new WebSocketService(store);

/**
 * @file
 * Composant principal qui va manager les différentes composants.
 * Il s'agit également de la vue mère
 */
class App extends React.Component {


  constructor(props) {
    super(props);
    this.fetchUser();
  }

  /*const onCreatingParty = async () => {
    try {
      await HttpService.createGame(this.state.user);
      message.success('Game created');
    } catch (err) {
      if (err.status === 401) {
        let dataToken = await CognitoService.refreshToken(this.state.user.userId, this.state.user.refreshToken);
        let user = this.state.user;
        user.tokenId = dataToken.tokenId;
        user.refreshToken = dataToken.refreshToken;
        this.setState({ user: user });
      }
      message.error('Unable to create a game');
    }
  }
*/

  fetchUser = async () => {
    let user = {};
    try {
      user = await CognitoService.getCurrentUser()
    } catch (error) {
      message.error(error);
    }
    if (user && user.isSessionValid) {
      return store.dispatch(login(user));
    }
    return store.dispatch(needToLogin());
  }


  render = () => {
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }

}

export default App;

