import React from 'react';
import Login from '../../components/Main/Login';

const LoginScreen = ({ match: { params }, history }) => {
    return <Login history={history}/>
}

export default LoginScreen;