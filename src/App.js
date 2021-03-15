import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap'

import './App.css';

import User from './components/Main/loggedIn';
import Homepage from './screens/Main/Homepage';
import Login from './screens/Main/Login';

function App() {
  return (
    <BrowserRouter basename="/">
      <Container style={{ marginTop: '1em' }}>
        <Route path="/" exact component={User(Homepage)} />
        <Route path="/login" component={Login} />
      </Container>
    </BrowserRouter>
  );
}

export default App;
