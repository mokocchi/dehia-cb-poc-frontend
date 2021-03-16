import React from 'react';
import HomepageContainer from '../../components/Main/HomepageContainer';
import { Container, Row, Col } from 'react-bootstrap';
import MenuContainer from '../../components/UI/MenuContainer';

const Homepage = ({ match: { params } }) => {
    return (
        <div>
            <MenuContainer loggedIn={true} />
            <Container>
                <Row>
                    <Col style={{ padding: "2em" }}>
                        <HomepageContainer />
                    </Col>
                </Row>
            </Container >
        </div>
    )
}

export default Homepage;