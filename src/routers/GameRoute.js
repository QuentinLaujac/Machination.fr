//Creates a new component for only showing the private routes available after login
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import LobbyGamePage from "../components/page/lobbyGamePage/LobbyGamePage";
import GamePage from "../components/page/gamePage/GamePage";


class GameRoute extends React.Component {

    shouldComponentUpdate = (nextProps) => {
        //should be updated if we are now login or if we join or change a game
        return (nextProps.isAuthenticated !== this.props.isAuthenticated ||
            nextProps.needToLogin !== this.props.needToLogin ||
            nextProps.gameInfos.status !== this.props.gameInfos.status);
    }

    render() {
        return (
            <Route {...this.props.rest} component={(props) => (
                this.props.isAuthenticated ? this.props.gameInfos.status === "IN_PROGRESS" ?
                    //IsAuthenticated
                    (
                        <div>
                            <GamePage {...{ ...props, user: this.props.user, id: (this.props.computedMatch && this.props.computedMatch.params) ? this.props.computedMatch.params.id : undefined }} />
                        </div>
                    ) :
                    (
                        <div>
                            <LobbyGamePage {...{ ...props, user: this.props.user, id: (this.props.computedMatch && this.props.computedMatch.params) ? this.props.computedMatch.params.id : undefined }} />
                        </div>
                    )
                    //IsNotAuthenticated
                    : this.props.needToLogin ? (
                        <Redirect to="/" />
                    ) :
                        (
                            <div>
                                <h1>En attente d'Authentification...</h1>
                            </div>
                        )
            )} />
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.user,
    user: Object.assign({}, state.auth.user),
    gameInfos: Object.assign({}, state.game.gameInfos),
    needToLogin: !!state.auth.needToLogin
});


export default connect(mapStateToProps)(GameRoute);
