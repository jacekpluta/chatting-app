import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  GridColumn
} from "semantic-ui-react";

import firebase from "../Firebase";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      loading: false
    };
  }
  //sets current Form Input row into a state
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormIsValid = () => {
    if (this.state.password.length > 5 || this.state.email.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormIsValid()) {
      this.setState({ loading: true, error: "" });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log("singed in", signedInUser);
          this.setState({ loading: false });
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false, error: error.message });
        });
    }
  };

  render() {
    const { email, password } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="green" textAlign="center">
            <Icon name="chain" color="green" />
            Login
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Adress"
                type="email"
                onChange={this.handleChange}
                value={email}
                className={
                  this.state.error.toLowerCase().includes("email")
                    ? "error"
                    : ""
                }
              />

              <Form.Input
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={this.handleChange}
                value={password}
                className={
                  this.state.error.toLowerCase().includes("password")
                    ? "error"
                    : ""
                }
              />

              <Button
                disabled={this.state.loading}
                className={this.state.loading ? "loading" : ""}
                color="green"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>

          {this.state.error !== "" && (
            <Message error>
              {" "}
              <h3>Error</h3>
              {this.state.error}
            </Message>
          )}
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Login;
