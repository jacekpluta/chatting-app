import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Root = props => (
  <Router>
    <Switch>
      <Route exact path="/" component={App}></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/register" component={Register}></Route>
    </Switch>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
