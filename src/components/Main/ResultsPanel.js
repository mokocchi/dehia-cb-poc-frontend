import React from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import LoadSpinner from '../UI/LoadSpinner';
import Icon from 'react-web-vector-icons';

const resultsVariant = (results) => {
    if (results.resultsLoading) {
        return "secondary";
    }
    if (results.error) {
        return "danger";
    }
    switch (results.status) {
        case "OK":
            return "success";
        case "SUSPENDED":
            return "warning";
        default:
            return "primary";
    }
}

const ResultsPanel = ({ results, cb }) => {
    const rStatus = results.status;
    const rError = results.error;
    const rLoading = results.loading;
    const rResultsLoading = results.resultsLoading;
    const rData = results.data;
    const rBreakerEnabled = results.circuitBreakerEnabled;
    const rBreakerLoading = results.circuitBreakerLoading;

    return (<Card>
        <Card.Header><h3>Results Service</h3></Card.Header>
        <Card.Body>
            {rLoading ? <LoadSpinner /> : (
                <Row>
                    <Col>
                        <Alert variant={resultsVariant(results)}>
                            <Row>
                                <Col>
                                    Status: {rError ? rError : (rResultsLoading ? "Fetching results..." : rStatus)} <br />
                                    Circuit Breaker: {rBreakerEnabled ? "Enabled" : "Disabled"} <br /><br />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button onClick={cb.onClickRetrieve}>Retrieve results <Icon name="download" font="MaterialCommunityIcons" color="white" size={"1.5rem"} /></Button>
                                    {rBreakerLoading ? <LoadSpinner />
                                        :
                                        rBreakerEnabled ? <Button variant="secondary" onClick={_ => cb.onChangeCircuitBreaker(false)} className="float-right"> Disable Circuit Breaker <Icon name="pipe" font="MaterialCommunityIcons" color="white" size={"1.5rem"} /></Button>
                                            : <Button variant="warning" onClick={_ => cb.onChangeCircuitBreaker(true)} className="float-right"> Enable Circuit Breaker <Icon name="pipe-disconnected" font="MaterialCommunityIcons" color="white" size={"1.5rem"} /></Button>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>&nbsp;</Col>
                            </Row>
                            <Row>
                                <Col>
                                    {rResultsLoading ? <LoadSpinner />
                                        :
                                        rData &&
                                        <Card>
                                            <Card.Header>
                                                Results
                                </Card.Header>
                                            <Card.Body>

                                                <ul>
                                                    {rData.map((item, index) =>
                                                        <li key={index}>{item}</li>
                                                    )}
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    }
                                </Col>
                            </Row>
                        </Alert>
                    </Col>
                </Row>
            )}
        </Card.Body>
    </Card >)
}

export default ResultsPanel;