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
                checked: false,
                status: null
            },
            results: {
                loading: true,
                resultsLoading: false,
                error: null,
                circuitBreakerEnabled: false,
                circuitBreakerLoading: false,
                data: null
            },
            metrics: {
                testStarted: false,
                step: 0,
                text: [],
                loading: false,
                stop: false
            }
        }
    }

    componentDidMount() {
        this.loadStatus();
    }

    stopTest = _ => {
        const metrics = this.state.metrics;
        metrics.stop = true;
        metrics.loading = false;
        this.setState({
            metrics
        })
    }

    startTest = async _ => {
        let metrics = this.state.metrics;
        metrics.testStarted = true;
        metrics.stop = false;
        this.setState({
            metrics
        })
        let text = [];
        const elapsedTimes = [];
        if (this.state.collect.status === "OK") {
            text[0] = "Operation should be normal. Sending first request...";
        } else {
            if (this.state.results.circuitBreakerEnabled) {
                text[0] = "Circuit breaker enabled. Sending first request..."
            } else {
                text[0] = "Circuit breaker disabled. Sending first request..."
            }
        }
        metrics = this.state.metrics;
        metrics.text = text;
        metrics.loading = true;
        this.setState({
            metrics
        })
        for (let index = 1; index <= 10; index++) {
            if (this.state.metrics.stop) {
                text[text.length] = "Test stopped";
                metrics.text = text;
                this.setState({
                    metrics
                })
                return;
            }
            const time1 = Date.now();
            let failed;
            try {
                const response = await tokenManager.getResults();
                failed = response.error_code !== undefined;
            } catch (e) {
                failed = true;
            }
            const time2 = Date.now();
            const interval = new Date(time2).getTime() - new Date(time1).getTime();
            text[index] = `Request ${index}. Elapsed time: ${interval}ms (${failed ? "Failed" : "Success"})`;
            elapsedTimes[index - 1] = interval;
            metrics.step = index;
            metrics.text = text;
            this.setState({
                metrics
            })
        }
        const avg = elapsedTimes.reduce((x, y) => x + y) / 10;
        const max = elapsedTimes.reduce((x, y) => (x > y) ? x : y);
        const min = elapsedTimes.reduce((x, y) => (x < y) ? x : y);
        metrics.loading = false;
        text[11] = `Average: ${avg.toFixed(2)}ms.`;
        text[12] = `Max time: ${max}ms. Min time: ${min}ms`;
        this.setState({
            metrics
        });
    }

    onClickRetrieve = _ => {
        const results = this.state.results;
        results.resultsLoading = true;
        this.setState({
            results
        })
        tokenManager.getResults().then(response => {
            if (response.data) {
                if (response.error_code) {
                    const results = this.state.results;
                    results.error = response.user_message;
                    results.resultsLoading = false;
                    results.data = null;
                    this.setState({
                        results
                    })
                } else {
                    const results = this.state.results;
                    results.data = response.data.results;
                    results.resultsLoading = false;
                    results.error = null;
                    this.setState({
                        results
                    })
                }
            } else {
                const results = this.state.results;
                if (response.developer_message) {
                    results.error = response.developer_message;
                } else {
                    results.error = "Unknown Error";
                }
                results.data = null;
                results.resultsLoading = false;
                this.setState({
                    results
                })
            }
        })
    }

    onChangeBreaker = (enable) => {
        if (enable) {
            const results = this.state.results;
            results.circuitBreakerLoading = true;
            this.setState({
                results
            })
            tokenManager.enableCircuitBreaker().then(res => {
                if (res.status !== 200) {

                    if (res.error_code) {
                        console.log(res);
                        this.setState({
                            results: {
                                circuitBreakerEnabled: false,
                                circuitBreakerLoading: false,
                                error: "Error"
                            }
                        })

                    } else {
                        console.log(res)
                        const results = this.state.results;
                        results.circuitBreakerLoading = false;
                        results.error = "Unknown Error"
                        this.setState({
                            results
                        })
                    }
                } else {
                    this.setState({
                        results: {
                            circuitBreakerLoading: false,
                            circuitBreakerEnabled: true,
                            error: null,
                            status: "Circuit breaker enabled"
                        }
                    })
                }
            }).catch(error => {
                console.log(error)
                this.setState({
                    results: {
                        circuitBreakerEnabled: false,
                        circuitBreakerLoading: false,
                        error: "Error"
                    }
                })
            })
        } else {
            const results = this.state.results;
            results.circuitBreakerLoading = true;
            this.setState({
                results
            })
            tokenManager.disableCircuitBreaker().then(response => {
                if ((response.status !== 200) && (response.status !== 304)) {
                    if (response.error_code) {
                        this.setState({
                            results: {
                                error: response.user_message,
                                loading: false,
                            }
                        })
                    } else {
                        console.log(response)
                        const results = this.state.results;
                        results.circuitBreakerLoading = false;
                        results.error = "Unknown Error"
                        this.setState({
                            results
                        })
                    }
                } else {
                    const results = this.state.results;
                    results.circuitBreakerLoading = false;
                    results.circuitBreakerEnabled = false;
                    results.error = null;
                    this.setState({
                        results
                    })
                }
            }).catch(error => {
                console.log(error)
                this.setState({
                    results: {
                        circuitBreakerLoading: false,
                        error: "Unknown error"
                    }
                })
            })
        }
    }

    onChangeCollect = (enable) => {
        if (!this.state.collect.disabled) {
            if (enable) {
                const collect = this.state.collect;
                collect.loading = true;
                this.setState({
                    collect
                })
                tokenManager.removeResourceSwitch().then(response => {
                    if ((response.status !== 200) && (response.status !== 304)) {
                        if (response.error_code) {
                            this.setState({
                                collect: {
                                    error: response.user_message,
                                    loading: false,
                                }
                            })
                        } else {
                            console.log(response)
                            this.setState({
                                collect: {
                                    error: "Unknown error",
                                    loading: false,
                                }
                            })
                        }
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
                }).catch(error => {
                    console.log(error)
                    this.setState({
                        collect: {
                            loading: false,
                            error: "Error"
                        }
                    })
                })
            } else {
                const collect = this.state.collect;
                collect.loading = true;
                this.setState({
                    collect
                })
                tokenManager.createResourceSwitch().then(res => {
                    if (res.error_code) {
                        console.log(res);
                        this.setState({
                            collect: {
                                loading: false,
                                error: "Error"
                            }
                        })
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
                }).catch(error => {
                    console.log(error)
                    this.setState({
                        collect: {
                            loading: false,
                            error: "Error"
                        }
                    })
                })
            }
        }
    }

    loadCollectStatus = () => {
        tokenManager.getCollectStatus().then(
            response => {
                if((response.status !== 200) && (response.status !== 304)) {
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
                            error: "Unknown error",
                            loading: false,
                            disabled: true
                        }
                    })
                }
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
        ).catch(error => {
            console.log(error)
        });
    }

    loadResultsStatus = () => {
        tokenManager.getResultsStatus().then(
            response => {
                if ((response.status !== 200) && (response.status !== 304)) {
                    if (response.error_code) {
                        this.setState({
                            results: {
                                error: response.user_message,
                                loading: false,
                                disabled: true
                            }
                        })
                    } else {
                        console.log(response)
                        this.setState({
                            results: {
                                error: "Unknown error",
                                loading: false,
                                disabled: true
                            }
                        })
                    }
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
        ).catch(error => {
            console.log(error)
        });

        const results = this.state.results;
        results.circuitBreakerLoading = true;
        this.setState({
            results
        });
        tokenManager.getCircuitBreakerStatus().then(
            response => {
                const results = this.state.results;
                results.circuitBreakerLoading = false;
                results.circuitBreakerEnabled = (response.data.status === "enabled")
                this.setState({
                    results
                });
            }
        ).catch(error => {
            console.log(error);
            const results = this.state.results;
            results.error = "Unknown error";
            results.circuitBreakerLoading = false;
            this.setState({
                results
            });
        })
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
            metrics={this.state.metrics}
            cb={{
                onChangeCollect: this.onChangeCollect,
                onClickRetrieve: this.onClickRetrieve,
                onChangeCircuitBreaker: this.onChangeBreaker,
                startTest: this.startTest,
                stopTest: this.stopTest
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