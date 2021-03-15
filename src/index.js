import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from './redux/index';
import './icons';

import App from './App';
import tokenManager from './utils/tokenManager';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer,
    composeEnhancers()
)

tokenManager.initialize(store);
tokenManager.loadApiUser();

ReactDOM.render(

        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
)
