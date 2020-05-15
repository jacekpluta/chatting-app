import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'intro.js/introjs.css';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { setUser, clearUser } from './actions';
import Spinner from './components/Spinner';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';

import firebase from '../src/components/Firebase';

import { connect } from 'react-redux';
import Redux from './Redux';

const Root = (props) => {
	const historyPush = props.history.push;

	const { setUser, clearUser } = props;

	const [ userRegistered, setUserRegistered ] = useState(false);

	const userCreated = () => {
		setUserRegistered(true);
	};

	useEffect(
		() => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					setUser(user);
					historyPush('/');
				} else {
					historyPush('/login');
					clearUser();
				}
			});
		},
		[ historyPush, userRegistered ]
	);

	return props.isLoading ? (
		<Spinner />
	) : (
		<Switch>
			<Route exact path="/" render={(props) => <App {...props} userRegistered={userRegistered} />} />
			<Route path="/login" render={(props) => <Login {...props} userRegistered={userRegistered} />} />
			<Route path="/register" render={(props) => <Register {...props} userCreated={userCreated} />} />
		</Switch>
	);
};

const mapStateFromProps = (state) => ({
	isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser, clearUser })(Root));

ReactDOM.render(
	<Redux>
		<Router>
			<RootWithAuth />
		</Router>
	</Redux>,
	document.getElementById('root')
);
registerServiceWorker();
