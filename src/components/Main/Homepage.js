import React from 'react';
import { Col, Row } from 'react-bootstrap';
import MetricsPanel from './MetricsPanel';
import CollectPanel from './CollectPanel';
import ResultsPanel from './ResultsPanel';

function Homepage({ name, collect, results, cb }) {
    return <div>
        <Row>
            <Col>
                <h2>
                    {name}'s Session
                    </h2>
            </Col>
        </Row>
        <Row>
            <Col>
                <CollectPanel collect={collect} cb={cb} />
            </Col>
            <Col>
                <ResultsPanel results={results} cb={cb} />
            </Col>
        </Row>
        <Row>
            <Col>
                <MetricsPanel cb={cb}/>
            </Col>
        </Row>
    </div>
}

export default Homepage;