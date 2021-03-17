import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { REQUEST_COUNT } from '../../config';

const generateLabels = _ => {
    const labels = [];
    for (let index = 0; index < REQUEST_COUNT; index++) {
        const label = `R${index + 1}`;
        labels.push(label);
    }
    return labels;
}
const ChartsPanel = ({ metrics, cb }) => {
    return (
        <Card>
            <Card.Header>
                <h3>Charts</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Line data={{
                            labels: generateLabels(),
                            datasets: metrics.datasets
                        }} options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        suggestedMin: 0,
                                        suggestedMax: 8000
                                    }
                                }]
                            },
                            showLines: true,
                            title: {
                                display: true,
                                text: 'Response time (in ms) for each request'
                            },
                        }
                        } />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={cb.onClickClear}>Clear</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default ChartsPanel;