import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers/index';

const store = createStore(rootReducer, composeWithDevTools());

export default (props) => {
	return <Provider store={store}>{props.children}</Provider>;
};
