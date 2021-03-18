import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import MetricsPanel from './MetricsPanel';
import CollectPanel from './CollectPanel';
import ResultsPanel from './ResultsPanel';
import ChartsPanel from './ChartsPanel';

function Homepage({ name, collect, results, metrics, cb }) {
    return <div>
        <Row>
            <Col>
                <h2>
                    {name}'s Session
                    </h2>
                <Alert variant="warning">The services and gateway are hosted on Heroku - Please be patient the first time you open the app</Alert>
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
                <MetricsPanel metrics={metrics} cb={cb} />
            </Col>
        </Row>
        <Row>
            <Col>
                {metrics.data && <ChartsPanel metrics={metrics} cb={cb} />}
            </Col>
        </Row>
    </div>
}

export default Homepage;