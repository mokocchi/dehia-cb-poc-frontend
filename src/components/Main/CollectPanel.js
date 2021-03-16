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

const CollectPanel = ({collect, cb}) => {
    const cStatus = collect.status;
    const cError = collect.error;
    const cLoading = collect.loading;
    return (<Card>
        <Card.Header><h3>Collect Service</h3></Card.Header>
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
    </Card>)
}

export default CollectPanel;