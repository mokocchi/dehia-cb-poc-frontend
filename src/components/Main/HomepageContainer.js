import React, { Component } from 'react';
import { connect } from 'react-redux';
import tokenManager from '../../utils/tokenManager';
import Homepage from './Homepage';

class HomepageContainer extends Component {
    constructor() {
        super();
        this.state = {
            collect: {
                loading: true,
                error: null,
                disabled: true,
                checked: false
            },
            results: {}
        }
    }

    componentDidMount() {
        this.loadStatus();
    }

    onChangeCollect = (enable) => {
        if (!this.state.collect.disabled) {
            if (enable) {
                const collect = this.state.collect;
                collect.loading = true;
                this.setState({
                    collect
                })
                tokenManager.removeResourceSwitch().then(res => {
                    if (res.error_code) {
                        console.log(res);
                    } else {
                        this.setState({
                            collect: {
                                loading: false,
                                error: null,
                                disabled: false,
                                checked: false,
                                status: "OK"
                            }
                        })
                    }
                }).catch(error => console.log(error))
            } else {
                const collect = this.state.collect;
                collect.loading = true;
                this.setState({
                    collect
                })
                tokenManager.createResourceSwitch().then(res => {
                    if (res.error_code) {
                        console.log(res);
                    } else {
                        this.setState({
                            collect: {
                                loading: false,
                                error: null,
                                disabled: false,
                                checked: true,
                                status: "SUSPENDED"
                            }
                        })
                    }
                }).catch(error => console.log(error))
            }
        }
    }

    loadCollectStatus = () => {
        tokenManager.getCollectStatus().then(
            response => {
                if (response.error_code) {
                    this.setState({
                        collect: {
                            error: response.user_message,
                            loading: false,
                            disabled: true
                        }
                    })
                } else {
                    this.setState({
                        collect: {
                            status: response.status,
                            loading: false,
                            checked: response.status !== "OK",
                            disabled: false
                        }
                    })
                }
            }
        ).catch(error => console.log(error));
    }

    loadStatus = async () => {
        //collect status
        this.loadCollectStatus();

    }

    render() {
        return <Homepage name={this.props.name} collect={this.state.collect} cb={{ onChangeCollect: this.onChangeCollect }} />
    }
}

function mapStateToProps(state) {
    return {
        name: "Juan"
    }
}
export default connect(mapStateToProps)(HomepageContainer);