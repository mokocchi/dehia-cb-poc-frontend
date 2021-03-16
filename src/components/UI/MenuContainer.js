import React, {Component} from 'react';
import { connect } from 'react-redux';
import { apiUserLoggedOut } from '../../redux/actions';
import Menu from './Menu';

class MenuContainer extends Component {
    logout = _ => {
        sessionStorage.removeItem('auth');
        this.props.dispatch(apiUserLoggedOut());
    }

    render() {
        return <Menu loggedIn={this.props.loggedIn} logout={this.logout}/>
    }
}

export default connect((state) => {return {}})(MenuContainer);