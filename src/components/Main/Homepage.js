import React from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import LoadSpinner from '../UI/LoadSpinner';
import Icon from 'react-web-vector-icons';

const collectVariant = (collect) => {
    if (collect.loading) {
        return "secondary";
    }
    if (collect.error) {
        return "danger";
    }
    switch (collect.status) {
        case "OK":
            return "success";
        case "SUSPENDED":
            return "warning";
        default:
            return "primary";
    }
}
function Homepage({ name, collect, results, cb }) {
    const cStatus = collect.status;
    const cError = collect.error;
    const cLoading = collect.loading;

    const rStatus = results.status;
    const rError = results.error;
    const rLoading = results.loading;
    const rData = results.data;
    const rBreakerEnabled = results.rBreakerEnabled;

    return <div>
        <div>
            {name}'s Session
        </div>
        <Row>
            <Col>
                <Card>
                    <Card.Header>Collect Service</Card.Header>
                    <Card.Body>
                        {cLoading ? <LoadSpinner /> : (
                            <Row>
                                <Col>
                                    <Alert variant={collectVariant(collect)}>
                                        <Row>
                                            <Col>
                                                Status: {cError ? cError : cStatus}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>

                                                {collect.checked ?
                                                    <Button className="float-right" variant="success" disabled={collect.disabled} onClick={_ => cb.onChangeCollect(true)}>
                                                        Enable Endpoint <Icon name="ethernet-cable" font="MaterialCommunityIcons" color="white" size={"1.5rem"} />
                                                    </Button>
                                                    :
                                                    <Button className="float-right" variant="warning" disabled={collect.disabled} onClick={_ => cb.onChangeCollect(false)}>
                                                        Disable Endpoint <Icon name="ethernet-cable-off" font="MaterialCommunityIcons" color="white" size={"1.5rem"} />
                                                    </Button>
                                                }
                                            </Col>
                                        </Row>
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card>
                    <Card.Header>Results Service</Card.Header>
                    <Card.Body>
                        {rLoading ? <LoadSpinner /> : (
                            <Row>
                                <Col>
                                    <Alert variant={collectVariant(results)}>
                                        <Row>
                                            <Col>
                                                Status: {rError ? rError : rStatus}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button onClick={cb.onClickRetrieve}>Retrieve results <Icon name="download" font="MaterialCommunityIcons" color="white" size={"1.5rem"} /></Button>
                                                <Button onClick={cb.onClickCircuitBreaker} className="float-right">{rBreakerEnabled ? "Disable" : "Enable"} Circuit Breaker <Icon name="arrow-decision" font="MaterialCommunityIcons" color="white" size={"1.5rem"} /></Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>&nbsp;</Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Card>
                                                    <Card.Header>
                                                        Results
                                            </Card.Header>
                                                    <Card.Body>
                                                        {rData &&
                                                            <ul>
                                                                {rData.map((item, index) =>
                                                                    <li key={index}>{item}</li>
                                                                )}
                                                            </ul>
                                                        }
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
}

export default Homepage;