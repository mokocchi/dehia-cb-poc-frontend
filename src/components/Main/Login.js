import React, { Component } from "react";
import { connect } from "react-redux";
import { loadingApiUser } from "../../redux/actions";
import tokenManager from "../../utils/tokenManager";
import LoadSpinner from "../UI/LoadSpinner";
import Menu from "../UI/Menu";

class Login extends Component {

    componentDidMount() {
        this.props.dispatch(loadingApiUser())
        tokenManager.login().then(
            auth => {
                tokenManager.storeUserIfValidJWT(auth)
            }
        )
        this.props.history.push("/")
    }
    render() {
        return (<div>
            <Menu loggedIn={false} />
            <LoadSpinner />
        </div>)
    }
}

export default connect((state) => { return {} })(Login);