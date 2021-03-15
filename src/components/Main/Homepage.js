import React from 'react';
import { Card } from 'react-bootstrap';
import LoadSpinner from '../UI/LoadSpinner';

const collectVariant = (collect) => {
    if (collect.loading) {
        return "secondary";
    }
    if (collect.error) {
        return "warning";
    }
    switch (collect.status) {
        case "OK":
            return "success";
        case "SUSPENDED":
            return "danger";
        default:
            return "primary";
    }
}
function Homepage({ name, collect }) {
    const cStatus = collect.status;
    const cError = collect.error;
    const cLoading = collect.loading;
    return <div>
        <div>
            {name}'s Session
        </div>
        <Card bg={collectVariant(collect)}>
            <Card.Header>Collect Status</Card.Header>
            <Card.Body>
                {cLoading ? <LoadSpinner /> : (cError ? cError : cStatus)}
            </Card.Body>
        </Card>
    </div>
}

export default Homepage;