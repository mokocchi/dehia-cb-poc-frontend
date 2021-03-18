import React, { Component } from 'react';
import { connect } from 'react-redux';
import { REQUEST_COUNT } from '../../config';
import tokenManager from '../../utils/tokenManager';
import Homepage from './Homepage';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
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
                stop: false,
                data: false,
                datasets: []
            }
        }
    }

    componentDidMount() {
        this.loadStatus();
    }

    onClickClear = _ => {
        const metrics = this.state.metrics;
        metrics.data = false;
        metrics.datasets = [];
        this.setState({
            metrics
        })
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
        metrics.step = 0;
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
        for (let index = 1; index <= REQUEST_COUNT; index++) {
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
            let cached = false;
            try {
                const response = await tokenManager.getResults();
                if (response.data.results) {
                    cached = response.data.results[0] === "old";
                } else {
                    failed = true;
                }
            } catch (e) {
                console.log(e);
                failed = true;
            }
            const time2 = Date.now();
            const interval = new Date(time2).getTime() - new Date(time1).getTime();
            const outcome = failed ? "Failed" : (cached ? "Substitute results" : "Success");
            text[index] = `Request ${index}. Elapsed time: ${interval}ms (${outcome})`;
            elapsedTimes[index - 1] = [interval, outcome];
            metrics.step = index;
            metrics.text = text;
            this.setState({
                metrics
            })
        }
        const times = elapsedTimes.map(x => x[0]);
        const avg = times.reduce((x, y) => x + y) / REQUEST_COUNT;
        const max = times.reduce((x, y) => (x > y) ? x : y);
        const min = times.reduce((x, y) => (x < y) ? x : y);
        metrics.loading = false;
        text[text.length] = `Average: ${avg.toFixed(2)}ms.`;
        text[text.length] = `Max time: ${max}ms. Min time: ${min}ms`;
        metrics.text = text;
        metrics.data = true;
        console.log("Test result:");
        console.log(elapsedTimes);

        const datasets = metrics.datasets;
        const color = getRandomColor();
        const count= Math.round(datasets.length / 2) + 1;
        datasets[datasets.length] = {
            label: `Test ${count} (bars)`,
            backgroundColor: elapsedTimes.map(x => (x[1] === "Failed") ? "red" : (x[1] === "Success" ? "green" : "yellow")),
            borderColor: elapsedTimes.map(x => "black"),
            borderWidth: "1",
            data: elapsedTimes.map((x, index) => { return { x: (index + 1), y: x[0] } }),
            type: "bar",
        };
        datasets[datasets.length] = {
            label: `Test ${count} (lines)`,
            fill: false,
            borderColor: color,
            borderWidth: "3",
            data: elapsedTimes.map((x, index) => { return { x: (index + 1), y: x[0] } }),
            type: "line",
            showLines: true,
            lineTension: 0
        };
        metrics.datasets = datasets;
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
                if ((response.status !== 200) && (response.status !== 304)) {
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
                stopTest: this.stopTest,
                onClickClear: this.onClickClear
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