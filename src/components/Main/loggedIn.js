import React from "react";
import { connect } from "react-redux";
import LoadSpinner from "../UI/LoadSpinner";
import LoginButton from "./LoginButton";

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}
const loggedIn = (WrappedComponent) => {
    return connect(mapStateToProps)((props) =>
        (props.auth.isLoading) ?
            <LoadSpinner />
            :
            props.auth.name ?
                < WrappedComponent {...props} />
                :
                <LoginButton {...props} />
    )
}
export default loggedIn;