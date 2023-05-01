//Creates a new component for only showing the private routes available after login
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import CustomHeader from "../components/elements/CustomHeader";



export const PrivateRoute = ({
    isAuthenticated,
    user,
    component: Component,
    ...rest
}) => (
        <Route {...rest} component={(props) => (
            isAuthenticated ? (
                <div>
                    <CustomHeader />
                    <Component {...{ ...props, user: user }} />
                </div>
            ) : (
                    <Redirect to="/" />
                )
        )} />
    )

//The map fn
const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.user,
    user: Object.assign({}, state.auth.user)
})

export default connect(mapStateToProps)(PrivateRoute);