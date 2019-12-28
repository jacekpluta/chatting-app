import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { setUser } from "./actions";
import Spinner from "./components/Spinner";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import firebase from "../src/components/Firebase";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers/index";

const store = createStore(rootReducer, composeWithDevTools());

const Root = props => {
  useEffect(() => {
    console.log(props.isLoading);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        props.setUser(user);
        props.history.push("/");
      }
    });
  }, [props.history.push]);

  return props.isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/" component={App}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/register" component={Register}></Route>
    </Switch>
  );
};

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
