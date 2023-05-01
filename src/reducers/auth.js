import * as types from '../actions/actionTypes';

export default (state = {}, action) => {

    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return {
                user: action.user,
            }
        case types.LOGOUT_SUCCESS:
            return {}
        case types.NEED_TO_LOGIN:
            return {
                needToLogin: action.needToLogin
            }
        default:
            return state
    }
} 