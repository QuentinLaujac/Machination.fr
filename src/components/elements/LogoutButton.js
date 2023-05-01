import React from "react";
import { Button, message } from 'antd';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import CognitoService from '../../services/cognitoService';



const defaultState = {
    loading: false,
}

/**
 * @file
 * Composant principal qui va manager les différentes composants.
 * Il s'agit également de la vue mère
 */
class LogoutButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    signout = async () => {
        try {
            this.setState({ loading: true });
            await CognitoService.signout();
        } catch (err) {
            return message.error(this.props.t('unknown_error'));
        } finally {
            this.setState({ loading: false });
        }
        this.props.dispatchLogout();
    };

    render() {

        return (
            <Button type="primary" className="light-button" loading={this.state.loading} onClick={() => this.signout()}>
                {this.props.t('header_signout')}
            </Button>
        );
    }
}


const mapDispatchToProps = (dispatch) => ({
    dispatchLogout: () => dispatch(logout()),
});

export default connect(undefined, mapDispatchToProps)(withTranslation()(LogoutButton));

