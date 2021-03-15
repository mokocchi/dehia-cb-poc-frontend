import React from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import LoadSpinner from '../UI/LoadSpinner';

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
function Homepage({ name, collect, cb }) {
    const cStatus = collect.status;
    const cError = collect.error;
    const cLoading = collect.loading;
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
                                        Status: {cError ? cError : cStatus}
                                        {collect.checked ?
                                            <Button className="float-right" variant="success" disabled={collect.disabled} onClick={_ => cb.onChangeCollect(true)}>
                                                Enable Endpoint
                                            </Button>
                                            :
                                            <Button className="float-right" variant="secondary" disabled={collect.disabled} onClick={_ => cb.onChangeCollect(false)}>
                                                Disable Endpoint
                                            </Button>
                                        }
                                        <br/>
                                        <br/>
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Col>
            <Col>
            </Col>
        </Row>
    </div>
}

export default Homepage;