import * as types from './actionTypes';

//Example asynchrone
/*export const startLogIn = (email, password) => {
    return (dispatch) => {
        return CognitoService.authenticateUser(email, password).then(user => {
            dispatch(login(user));
        }).catch(error => {
            throw (error);
        });
    };
}*/

export const gameJoined = (gameId) => ({
    type: types.GAME_JOINED,
    game: { gameInfos: { gameId: gameId } },
})

export const quitGame = () => ({
    type: types.GAME_QUIT,
    game: {},
})

export const updateGameRules = (gameInfos) => ({
    type: types.UPDATE_GAME_RULES,
    game: { gameInfos: gameInfos }
})

export const gameRulesUpdated = () => ({
    type: types.GAME_RULES_UPDATED
})

export const playerJoined = (player) => ({
    type: types.PLAYER_JOINED,
    game: { player: player }
})

export const playerLeft = (player) => ({
    type: types.PLAYER_LEFT,
    game: { player: player }
})

export const gotRefreshGameData = (game) => ({
    type: types.GOT_REFRESH_GAME_DATA,
    game: game
})

export const sendMessage = (message, receiver) => ({
    type: types.GAME_SEND_MSG,
    game: { message: message, receiver: receiver }
})

export const receiveMessage = (message) => ({
    type: (message.receiver === "ALL") ? types.GAME_RECEIVE_GENERAL_MSG : types.GAME_RECEIVE_PRIVATE_MSG,
    game: { message: message }
})

export const receiveEventMessage = (message) => ({
    type: types.RECEIVE_EVENT_MESSAGE,
    game: { message: message }
})

export const messageSent = () => ({
    type: types.GAME_SENT_MSG,
    game: { message: undefined }
})

export const sendAction = (name, data) => ({
    type: types.SEND_GAME_ACTION,
    game: { action: { name: name, data: data } }
})

export const actionSent = () => ({
    type: types.GAME_ACTION_SENT,
    game: { action: undefined }
})

export const actionToProcessed = (action) => ({
    type: types.GAME_ACTION_TO_PROCESSED,
    game: { action: action }
})

export const actionProcessed = (skipInGameInfos) => ({
    type: types.GAME_ACTION_PROCESSED,
    game: { action: undefined, skipInGameInfos: skipInGameInfos }
})

export const receiveRolePlayer = (rolePlayer) => ({
    type: types.RECEIVE_ROLE_PLAYER,
    game: { rolePlayer: rolePlayer }
})

export const knowWitness = (witness) => ({
    type: types.KNOW_WITNESS,
    game: { witness: witness }
})

export const knowEvidence = (evidence, evidence_type) => ({
    type: types.KNOW_EVIDENCE,
    game: { evidence: evidence, evidence_type: evidence_type }
})

export const addWitnessQuestion = (witnessQuestion) => ({
    type: types.ADD_WITNESS_QUESTION,
    game: { witnessQuestion: witnessQuestion }
})

export const witnessQuestionProcessed = () => ({
    type: types.WITNESS_QUESTION_PROCESSED,
    game: {}
})


