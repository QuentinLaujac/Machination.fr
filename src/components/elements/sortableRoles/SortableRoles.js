import React from "react";
import './sortableRoles.css';
import { withTranslation } from 'react-i18next'
import Role from './../role/Role';
import DragSortableList from 'react-drag-sortable';
import { Row } from 'antd';



class SortableRoles extends React.Component {

    listHorizontal = () => {

        const imutableRoles = [...this.props.roles];
        const indexWitnessRole = this.props.roles.findIndex(role => role.role === "WITNESS");
        imutableRoles.splice(indexWitnessRole, 1);

        let spanSize = this.props.players.length === 7 ? 2 : (Math.trunc(24 / this.props.players.length));
        const list = this.props.players.map((player, i) => {
            return {
                content: (
                    <Role role={{ role: player.isWitness ? "WITNESS" : imutableRoles.shift().role, checked: true }} info={false} />
                ), classes: ["ant-col-" + spanSize, "center"]
            }
        });

        this.onSortRole(list);

        return list;
    }

    onSortRole = (sortedList) => {
        const rolePlayers = sortedList.map((role, i) => {
            const player = this.props.players[i];
            return { userId: player.userId, roleName: role.content.props.role.role }
        })
        this.props.onSort(rolePlayers);
    }

    render() {
        return (
            <Row className="sortableRoles" justify="center">
                <DragSortableList items={this.listHorizontal()} moveTransitionDuration={0.3} dropBackTransitionDuration={0.3} onSort={this.onSortRole} type="horizontal" />
            </Row>
        );
    }
}

export default withTranslation()(SortableRoles);

