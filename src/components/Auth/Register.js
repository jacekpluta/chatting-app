import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  GridColumn,
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
      usersRef: firebase.database().ref("users"),
    };
  }

  //checking if the form is valid or not then returns true or false
  isFormIsValid = () => {
    let error;
    if (this.isFormEmpty()) {
      error = "Fill all fields";
      this.setState({ error: error });
      return false;
    } else if (this.isPasswordValid()) {
      return false;
    } else {
      this.setState({ error: "" });
      return true;
    }
  };

  //checking if the form is empty or not then returns true or false
  isFormEmpty = () => {
    return (
      !this.state.username.length ||
      !this.state.email.length ||
      !this.state.password.length ||
      !this.state.passwordConfirmation.length
    );
  };

  //display if register was a success or not
  handleStatusMessage = () => {
    return console.log("Lol");
  };

  //checking if the password is valid or not then returns true or false
  isPasswordValid = () => {
    if (
      this.state.password.length < 6 ||
      this.state.passwordConfirmation.length < 6
    ) {
      this.setState({ error: "Password must be at least 6 characters" });
      return true;
    } else if (
      this.state.password.length !== this.state.passwordConfirmation.length
    ) {
      this.setState({ error: "Passwords length don't match" });
      return true;
    } else {
      return false;
    }
  };

  //sets current Form Input row into a state
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  //runs on submit form button click, sets loading, updates user with display name and random photo URL from gravatar
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormIsValid()) {
      this.setState({ loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          this.handleStatusMessage(); //Show success message
          firebase.auth().signOut();
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `https://www.gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
              darkmode: false,
              tutorial: true,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              });
            })
            .then(() => {
              this.setState({ loading: false, error: "" });
            })
            .then(() => {
              this.props.userCreated();
            })
            .catch((err) => {
              console.log("create user error", err);
              this.setState({ loading: false, error: err.message });
            });
        })
        .catch((err) => {
          console.log("create user error", err);
          this.setState({ loading: false, error: err.message });
        });
    }
  };

  //save user in firebase
  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      email: createdUser.user.email,
      darkmode: false,
      tutorial: true,
    });
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            icon
            color="blue"
            textAlign="center"
            style={{ marginTop: "20px" }}
          >
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
                color="blue"
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
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;
