import React from 'react';
import { Button, Navbar } from 'react-bootstrap';

const Menu = ({ loggedIn, logout }) => <Navbar className="navbar" bg="primary">
    <Navbar.Brand>Circuit Breaker PoC {loggedIn && "- Dashboard"}</Navbar.Brand>
    {loggedIn &&
        <Button onClick={logout} className="float-right" variant="outline-light">Logout</Button>
    }
</Navbar>

export default Menu;