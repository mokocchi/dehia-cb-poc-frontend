import axios from 'axios';
import React from 'react';
import { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_HOST } from '../../config';
import { waitFor } from '../../utils/utils';
import LoadSpinner from '../UI/LoadSpinner';

//ping gateway


class LoginButton extends Component {
    constructor() {
        super();
        this.state = {
            loading: true
        }
    }

    pingGateway = async () => {
        axios(API_HOST).then(res => {
            if (res.status === 200) {
                this.setState({
                    loading: false
                })

            }
        }).catch(error => console.log(error));
    }

    componentDidMount() {
        waitFor(_ => this.pingGateway() && (this.state.loading === false), 5000).then(_ =>
            this.setState({
                loading: false
            })
        )
    }

    render() {
        return (
            this.state.loading ? <div>
                <LoadSpinner text="Starting..."/>
            </div>
                : <div className="App">
                    <header className="App-header">
                        <h3>Login</h3>
                        <Link to="/login">
                            <Button variant={"outline-dark"}>
                                Login
            </Button>
                        </Link>
                    </header>
                </div>
        )
    }
}

export default LoginButton;