import React from "react";
import CharacterSlot from './characterSlot/CharacterSlot';

import { Col } from 'antd';

class CharactersSection extends React.Component {

    render() {
        const spanDivider = this.props.hideCamera ? this.props.playerList.length : this.props.playerList.length + 1
        const spanSize = this.props.playerList.length === 7 ? 2 : (Math.trunc(24 / spanDivider));
        return this.props.playerList.map((player, i) => {
            const camera = (Math.trunc(this.props.playerList.length / 2) === i) && !this.props.hideCamera ? (<Col span={4}><CharacterSlot onCharacterClick={() => { }} player={{ character: "camera", isConnected: true }} /></Col>) : (<></>);
            return (
                <React.Fragment key={"charactersSection" + i}>
                    {camera}
                    <Col span={spanSize}>
                        <CharacterSlot isGuilty={this.props.guiltyUserId === player.userId} hidePointer={this.props.hidePointer} hideInfoWitness={this.props.hideInfoWitness} hideVote={this.props.hideVote} onCharacterClick={this.props.onCharacterClick} player={{ ...player }} />
                    </Col>
                </React.Fragment>
            )
        });
    }
}

export default CharactersSection;

