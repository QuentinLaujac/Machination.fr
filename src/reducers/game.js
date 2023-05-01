import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default (state = initialState.game, action) => {

    switch (action.type) {
        case types.GAME_JOINED:
            const gameInfosUpdt = Object.assign({}, state.gameInfos);
            gameInfosUpdt.gameId = action.game.gameInfos.gameId;
            return {
                ...state, gameInfos: gameInfosUpdt
            }
        case types.GAME_QUIT:
            const initState = Object.assign({}, initialState.game);
            return {
                initState
            }
        case types.PLAYER_JOINED:
            const playersS = Object.assign([], state.players);
            return {
                ...state, players: [
                    ...playersS.filter(player => player.userId !== action.game.player.userId),
                    Object.assign({}, action.game.player)
                ]
            };
        case types.PLAYER_LEFT:
            const players = Object.assign([], state.players);
            const indexOfCatToDelete = players.findIndex(player => { return player.userId === action.game.player.userId })
            if (state.gameInfos.status === "IN_PROGRESS") {
                players[indexOfCatToDelete] = { ...players[indexOfCatToDelete], isConnected: false }
            } else {
                players.splice(indexOfCatToDelete, 1);
            }
            return {
                ...state, players: players
            };
        case types.GOT_REFRESH_GAME_DATA:
            const playersRefresh = action.game.players === undefined ? undefined : Object.assign([], action.game.players);
            const gameInfosRefresh = action.game.gameInfos === undefined ? undefined : Object.assign([], action.game.gameInfos);
            const generalMessages = action.game.messages === undefined ? undefined : Object.assign([], action.game.messages);
            const rolePlayer = action.game.rolePlayer === undefined ? undefined : Object.assign([], action.game.rolePlayer);
            const witQ = action.game.witnessQuestion === undefined ? undefined : Object.assign([], action.game.witnessQuestion);
            const returnState = { ...state };
            if (playersRefresh) returnState.players = playersRefresh;
            if (gameInfosRefresh) returnState.gameInfos = gameInfosRefresh;
            if (generalMessages) returnState.generalMessages = generalMessages;
            if (rolePlayer) returnState.rolePlayer = rolePlayer;
            if (witQ) returnState.witnessQuestion = witQ;
            return returnState;
        case types.GAME_SEND_MSG:
            const messageToSend = Object.assign([], state.messageToSend);
            messageToSend.push({ content: action.game.message, receiver: action.game.receiver });
            return {
                ...state, messageToSend: messageToSend
            };
        case types.GAME_SENT_MSG:
            const msgToSend = Object.assign([], state.messageToSend);
            msgToSend.shift();
            return {
                ...state, messageToSend: msgToSend
            };
        case types.GAME_RECEIVE_GENERAL_MSG:
            const generalMessagesG = Object.assign([], state.generalMessages);
            return {
                ...state, generalMessages: [
                    ...generalMessagesG.filter(message => message.sortId !== action.game.message.sortId),
                    Object.assign({}, action.game.message)
                ]
            };
        case types.RECEIVE_EVENT_MESSAGE:
            const genMessages = Object.assign([], state.generalMessages);
            return {
                ...state, generalMessages: [
                    ...genMessages.filter(message => message.sortId !== action.game.message.sortId),
                    Object.assign({}, action.game.message)
                ]
            };
        case types.UPDATE_GAME_RULES:
            const gameInfosToUpdate = Object.assign([], state.gameInfosToUpdate);
            gameInfosToUpdate.push(action.game.gameInfos);
            return {
                ...state, gameInfosToUpdate: gameInfosToUpdate
            };
        case types.GAME_RULES_UPDATED:
            const gameInfosToUpdated = Object.assign([], state.gameInfosToUpdate);
            gameInfosToUpdated.shift();
            return {
                ...state, gameInfosToUpdate: gameInfosToUpdated
            };
        case types.SEND_GAME_ACTION:
            const actionToSend = Object.assign([], state.gameActionToSend);
            actionToSend.push(action.game.action);
            return {
                ...state, gameActionToSend: actionToSend
            };
        case types.GAME_ACTION_SENT:
            const actionToSendUpdate = Object.assign([], state.gameActionToSend);
            actionToSendUpdate.shift();
            return {
                ...state, gameActionToSend: actionToSendUpdate
            };
        case types.GAME_ACTION_TO_PROCESSED:
            const actionToProcessed = Object.assign([], state.gameActionToProcessed);
            actionToProcessed.push(action.game.action);
            return {
                ...state, gameActionToProcessed: actionToProcessed
            };
        case types.GAME_ACTION_PROCESSED:
            const gameActionToProcessed = Object.assign([], state.gameActionToProcessed);
            const actionProcessed = gameActionToProcessed.shift();
            const gameInfos = action.game.skipInGameInfos ? { ...state.gameInfos } : { ...state.gameInfos, stepName: actionProcessed.name, stepDuration: actionProcessed.duration };
            return {
                ...state, gameActionToProcessed: gameActionToProcessed, gameInfos: gameInfos
            };
        case types.ADD_WITNESS_QUESTION:
            const witnessQuestionToProcessed = Object.assign([], state.witnessQuestion);
            witnessQuestionToProcessed.push(action.game.witnessQuestion);
            return {
                ...state, witnessQuestion: witnessQuestionToProcessed
            };
        case types.WITNESS_QUESTION_PROCESSED:
            const witnessQToProcessed = Object.assign([], state.witnessQuestion);
            witnessQToProcessed.shift();
            return {
                ...state, witnessQuestion: witnessQToProcessed
            };
        case types.RECEIVE_ROLE_PLAYER:
            return {
                ...state, rolePlayer: { ...action.game.rolePlayer }
            }
        case types.KNOW_WITNESS:
            const playersUpd = Object.assign([], state.players);
            const indexWitness = playersUpd.findIndex(player => player.userId === action.game.witness.userId);
            playersUpd[indexWitness].isWitness = true;
            return {
                ...state, players: playersUpd
            }
        case types.KNOW_EVIDENCE:
            const updRolePlayer = action.game.evidence ? { ...state.rolePlayer, evidence_fr: action.game.evidence.evidence_fr, clue_fr: action.game.evidence.clue_fr, evidence_type: action.game.evidence_type } : { ...state.rolePlayer, evidence_type: action.game.evidence_type };
            return {
                ...state, rolePlayer: updRolePlayer
            }
        default:
            return state
    }
} 