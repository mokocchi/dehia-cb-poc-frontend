import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap'

import './App.css';

import User from './components/Main/loggedIn';
import Homepage from './screens/Main/Homepage';
import Login from './screens/Main/Login';

function App() {
  return (
    <HashRouter basename="/">
      <Container style={{ marginTop: '1em' }}>
        <Route path="/" exact component={User(Homepage)} />
        <Route path="/login" component={Login} />
      </Container>
    </HashRouter>
  );
}

export default App;
