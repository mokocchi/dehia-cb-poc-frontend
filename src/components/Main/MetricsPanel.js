import React from 'react';
import { Button, Card, Row, Spinner, Col, Alert } from 'react-bootstrap';

const MetricsPanel = ({ metrics, cb }) => {
    return (
        <Card>
            <Card.Header>
                <h3>Test the current configuration</h3>
            </Card.Header>
            <Card.Body className="metrics-card-body">
                <Alert variant="warning"><ol>
                    <li>
                        Metrics are taken from the frontend
                                </li>
                    <li>
                        b) The worst case scenario may take up to 3 minutes
                                    </li>
                </ol>
                </Alert>
                {!metrics.testStarted ? <Button onClick={cb.startTest} variant="primary">Start test</Button>
                    :
                    <div>
                        <Row>
                            <Col>
                                <progress value={metrics.step} max="10"> 32% </progress>
                            </Col>
                            <Col>
                                {metrics.loading &&
                                    <Spinner animation="border" role="status" />
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <ul>
                                    {metrics.text.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </Col>
                            <Col>
                                {metrics.loading ?
                                    (<Button onClick={cb.stopTest} variant="danger">Stop current test</Button>)
                                    : (metrics.testStarted &&
                                        <div>
                                            <Button onClick={cb.startTest} variant="primary">Restart test</Button>
                                        </div>)
                                }
                            </Col>
                        </Row>
                    </div>
                }
            </Card.Body>
        </Card >
    )
}

export default MetricsPanel;