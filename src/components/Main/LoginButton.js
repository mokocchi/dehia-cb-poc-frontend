import axios from 'axios';
import React from 'react';
import { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_HOST } from '../../config';
import { waitFor } from '../../utils/utils';
import LoadSpinner from '../UI/LoadSpinner';
import Menu from '../UI/Menu';

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
            <div>
                <Menu loggedIn={false} />
                {this.state.loading ? <div>
                    <LoadSpinner text="Starting..." />
                </div>
                    : <div className="App">
                        <Row>
                            <Col>
                                <p>This is a proof of concept for the <a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker">Circuit Breaker</a> pattern. <br />
                                Log in to see the dashboard.<br />
                                You have 15 minutes.
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Link className="loginButton" to="/login">
                                    <Button variant={"outline-dark"}>
                                        Login
            </Button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                }
            </div>)
    }
}

export default LoginButton;