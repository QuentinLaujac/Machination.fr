import React from "react";
import './characterSlot.css';
import { Tooltip, Badge } from 'antd';
import { withTranslation } from 'react-i18next'

const characterImages = require.context('../../../assets/img/character', true);

class characterSlot extends React.Component {

    render() {
        const character = characterImages(`./${this.props.player.character}.png`);
        const characterCpnt = (<img src={character} onClick={() => { this.props.onCharacterClick(this.props.player) }} alt="character" className={"character " + (this.props.hidePointer ? "" : "pointer ") + (!!this.props.player.isConnected ? "" : "disconnected")} />);
        const usernameSection = this.props.player.username ? (<div className="playerName"><h3>{this.props.player.username}</h3></div>) : (<></>);
        return (
            <div className="characterSlot">
                <div className="playerSlot">
                    <div>
                        <Tooltip visible={(this.props.player.isWitness || this.props.isGuilty) && !this.props.hideInfoWitness} placement="top" title={this.props.player.isWitness ? this.props.t('characterSlot_witness') : this.props.t('characterSlot_guilty')}>
                            <Badge count={!this.props.hideVote ? this.props.player.nbVoteGuilty : 0}>
                                {characterCpnt}
                            </Badge>
                        </Tooltip>
                    </div>
                    {usernameSection}
                </div>
            </div>
        );
    }
}

export default withTranslation()(characterSlot);

