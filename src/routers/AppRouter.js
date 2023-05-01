import React from 'react';
import { message } from 'antd';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history'
import { connect } from 'react-redux';
import { quitGame } from '../actions/game';

import GameRoute from './GameRoute';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LobbyPage from '../components/page/LobbyPage';
import SigninPage from '../components/page/SigninPage';
import NotFoundPage from '../components/page/NotFoundPage';

import SignupPage from "../components/page/SignupPage";
import ForgetPasswordPage from "../components/page/ForgetPasswordPage";

//Browser Router provides with predefined history while Router gives custom histore
//Custom history for <Router>
export const history = createBrowserHistory();

class AppRouter extends React.Component {
  lastLocation = "";

  componentDidMount() {
    this.unlisten = history.listen((location, action) => {
      //if we quit a game
      if (this.lastLocation.includes("/game/") && !location.pathname.includes("/game/")) {
        message.destroy();//we remove all message game
        this.props.dispatchQuitGame();
      }
      //
      this.lastLocation = location.pathname;
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }

  render = () => (
    <Router history={history}>
      <div>
        <Switch>
          <PublicRoute path="/" exact={true} component={() => <SigninPage />} />
          <PublicRoute path="/signup" component={() => <SignupPage step={0} />} exact={true} />
          <PublicRoute path="/confirmRegistration" component={(routerParams) => <SignupPage step={1} routerParams={routerParams} />} exact={true} />
          <PublicRoute path="/forgetPassword" component={ForgetPasswordPage} exact={true} />
          <PrivateRoute path="/lobby" component={(props) => <LobbyPage {...props} />} />
          <GameRoute path="/game/:id" />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  )
}

const mapDispatchToProps = (dispatch) => ({
  dispatchQuitGame: () => dispatch(quitGame())
});

export default connect(undefined, mapDispatchToProps)(AppRouter);
