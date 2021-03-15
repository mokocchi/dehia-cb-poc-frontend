import React, { Component } from 'react';
import { connect } from 'react-redux';
import tokenManager from '../../utils/tokenManager';
import Homepage from './Homepage';

class HomepageContainer extends Component {
    constructor() {
        super();
        this.state = {
            collect: {
                loading: true
            },
            results: {}
        }
    }

    componentDidMount() {
        this.loadStatus();
    }

    loadStatus = async () => {
        //collect status
        tokenManager.getCollectStatus().then(
            response => {
                if (response.error_code) {
                    this.setState({
                        collect: {
                            error: response.user_message,
                            loading: false
                        }
                    })
                } else {
                    this.setState({
                        collect: {
                            status: response.status,
                            loading: false
                        }
                    })
                }
            }
        ).catch(error => console.log(error));

    }

    render() {
        return <Homepage name={this.props.name} collect={this.state.collect} />
    }
}

function mapStateToProps(state) {
    return {
        name: "Juan"
    }
}
export default connect(mapStateToProps)(HomepageContainer);