import React from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { REQUEST_COUNT } from '../../config';
import Icon from 'react-web-vector-icons';

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
                    <Alert variant="info"><Icon name="information" font="MaterialCommunityIcons" size={"1rem"} /> <b>Bar colors.</b> Green: Success. Yellow: Substitute Results. Red: Fail.</Alert>
                        <Bar data={{
                            labels: generateLabels(),
                            datasets: metrics.datasets
                        }} options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        suggestedMin: 0,
                                        suggestedMax: 8000
                                    }, 
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Response time (in ms)"
                                    }
                                }],
                                xAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Request number"
                                    }
                                }]
                            },
                            showLines: true,
                            title: {
                                display: true,
                                text: 'Response time (in ms) for each request'
                            },
                            tooltips: {
                                callbacks: {
                                    label: (item) => `${item.yLabel} ms`,
                                },
                            }
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