import React from 'react';
import HomepageContainer from '../../components/Main/HomepageContainer';
import { Container, Row, Col } from 'react-bootstrap';

const Homepage = ({ match: { params } }) => {
    return (
        <Container>
            <Row>
                <Col>
                    <h2>
                        Página principal
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col style={{ border: "1px solid black", padding: "2em" }}>
                    <HomepageContainer />
                </Col>
            </Row>
        </Container >
    )
}

export default Homepage;