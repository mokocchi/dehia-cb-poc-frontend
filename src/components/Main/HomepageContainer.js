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
            results: {
                loading: true,
                resultsLoading: false,
                error: null
            },
        }
    }

    componentDidMount() {
        this.loadStatus();
    }

    onClickRetrieve = _ => {
        const results = this.state.results;
        results.resultsLoading = true;
        this.setState({
            results
        })
        tokenManager.getResults().then(response => {
            if (response.data) {
                if (response.data.error_code) {
                    const results = {};
                    results.error = response.data.user_message;
                    results.resultsLoading = false;
                    this.setState({
                        results
                    })
                } else {
                    const results = {};
                    results.status = "OK";
                    results.data = response.data.results;
                    results.resultsLoading = false;
                    this.setState({
                        results
                    })
                }
            } else {
                const results = {};
                if(response.developer_message) {
                    results.error = response.developer_message;
                } else {
                    results.error = "Unknown Error";
                }
                results.resultsLoading = false;
                this.setState({
                    results
                })
            }
        })
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
                            error: response.data.user_message,
                            loading: false,
                            disabled: true
                        }
                    })
                } else {
                    this.setState({
                        collect: {
                            status: response.data.status,
                            loading: false,
                            checked: response.data.status !== "OK",
                            disabled: false
                        }
                    })
                }
            }
        ).catch(error => console.log(error));
    }

    loadResultsStatus = () => {
        tokenManager.getResultsStatus().then(
            response => {
                if (response.error_code) {
                    this.setState({
                        results: {
                            error: response.data.user_message,
                            loading: false,
                            disabled: true
                        }
                    })
                } else {
                    this.setState({
                        results: {
                            status: response.data.status,
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
        this.loadCollectStatus();
        this.loadResultsStatus();
    }

    render() {
        return <Homepage
            name={this.props.name}
            collect={this.state.collect}
            results={this.state.results}
            cb={{
                onChangeCollect: this.onChangeCollect,
                onClickRetrieve: this.onClickRetrieve
            }}
        />
    }
}

function mapStateToProps(state) {
    return {
        name: state.auth.name
    }
}
export default connect(mapStateToProps)(HomepageContainer);