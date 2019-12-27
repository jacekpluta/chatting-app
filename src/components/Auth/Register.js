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
import md5 from "md5";
import firebase from "../Firebase";

import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      error: "",
      loading: false,
      users: firebase.database().ref("users")
    };
  }

  isFormIsValid = () => {
    let error;

    if (this.isFormEmpty()) {
      error = "Fill all fields";
      this.setState({ error: error });
      return false;
    } else if (this.isPasswordValid()) {
      console.log("lol");
      error = "Password is invalid";
      this.setState({ error: error });
      return false;
    } else {
      this.setState({ error: "" });
      return true;
    }
  };

  isFormEmpty = () => {
    return (
      !this.state.username.length ||
      !this.state.email.length ||
      !this.state.password.length ||
      !this.state.passwordConfirmation.length
    );
  };

  isPasswordValid = () => {
    if (
      this.state.password.length < 6 ||
      this.state.passwordConfirmation.length < 6
    ) {
      return true;
    } else if (
      this.state.password.length !== this.state.passwordConfirmation.length
    ) {
      return true;
    } else {
      return false;
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormIsValid()) {
      this.setState({ loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `https://www.gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              });
            })
            .then(() => {
              this.setState({ loading: false, error: "" });
            })
            .catch(err => {
              console.log("create user error", err);
              this.setState({ loading: false, error: err.message });
            });
        })
        .catch(err => {
          console.log("create user error", err);
          this.setState({ loading: false, error: err.message });
        });
    }
  };

  saveUser = createdUser => {
    return this.state.users.child(createdUser);
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="blue" textAlign="center">
            <Icon name="rocket" color="blue" />
            Register
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                onChange={this.handleChange}
                value={username}
              />
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

              <Form.Input
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                type="password"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={
                  this.state.error.toLowerCase().includes("password")
                    ? "error"
                    : ""
                }
              />
              <Button
                disabled={this.state.loading}
                className={this.state.loading ? "loading" : ""}
                color="red"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {console.log(this.state.error)}
          {this.state.error !== "" && (
            <Message error>
              {" "}
              <h3>Error</h3>
              {this.state.error}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;
