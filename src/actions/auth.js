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

export const login = (user) => ({
    type: types.LOGIN_SUCCESS,
    user,
})

export const logout = () => ({
    type: types.LOGOUT_SUCCESS
})

export const needToLogin = () => ({
    type: types.NEED_TO_LOGIN,
    needToLogin: true
})
