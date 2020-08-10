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
import PropTypes from "prop-types";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import md5 from "md5";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      loading: false,
      registerSuccess: false,
      usersRef: firebase.database().ref("users"),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.userRegistered !== prevProps.userRegistered) {
      this.setState({ registerSuccess: true });
    }
  }

  //sets current Form Input row into a state
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormIsValid = () => {
    if (this.state.password.length > 5 || this.state.email.length > 0) {
      return true;
    } else {
      return true;
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormIsValid()) {
      this.setState({ loading: true, error: "" });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          this.setState({ loading: false });
          this.setState({
            loading: false,
            error: "Invalid login/password",
            email: "",
            password: "",
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false, error: error.message });
        });
    } else {
      this.setState({
        loading: false,
        error: "Invalid login/password",
        email: "",
        password: "",
      });
    }
  };

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //save user in firebase
  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      email: createdUser.user.email,
      darkmode: false,
      tutorial: true,
      guest: true,
    });
  };

  handleGuestLogin = (event) => {
    event.preventDefault();
    const guestName = `guest${this.getRandomIntInclusive(1, 99999999)}`;
    const guestEmail = `guest${this.getRandomIntInclusive(
      1,
      99999999
    )}@guestmail.com`;
    const guestPassword = `guestPass${this.getRandomIntInclusive(1, 99999999)}`;

    this.setState({ loading: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(guestEmail, guestPassword)
      .then((createdUser) => {
        // firebase.auth().signOut();
        createdUser.user
          .updateProfile({
            displayName: guestName,
            photoURL: `https://www.gravatar.com/avatar/${md5(
              guestEmail
            )}?d=identicon`,
            darkmode: false,
            tutorial: true,
            guest: true,
          })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              console.log(createdUser);
            });
          })
          .then(() => {
            this.setState({ loading: false, error: "" });
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

    // this.setState({ loading: true, error: "" });

    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(this.state.email, this.state.password)
    //   .then((signedInUser) => {
    //     console.log("singed in", signedInUser);
    //     this.setState({ loading: false });
    //     this.setState({
    //       loading: false,
    //       error: "Invalid login/password",
    //       email: "",
    //       password: "",
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setState({ loading: false, error: error.message });
    //   });
  };

  render() {
    const { email, password } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            icon
            color="blue"
            textAlign="center"
            style={{ marginTop: "20px" }}
          >
            <Icon name="chain" color="blue" />
            LOGIN
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
                color="blue"
                fluid
                size="large"
              >
                SUBMIT
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
          {this.state.registerSuccess && (
            <Message
              success
              header="Your user registration was successful"
              content="You may now log-in with the username you have chosen"
            />
          )}
          <Message>
            Don't have an account?{" "}
            <Link to="/register">
              <Button
                disabled={this.state.loading}
                className={this.state.loading ? "loading" : ""}
                color="red"
                size="mini"
              >
                REGISTER
              </Button>
            </Link>{" "}
            or{" "}
            <Button
              disabled={this.state.loading}
              className={this.state.loading ? "loading" : ""}
              color="green"
              size="mini"
              onClick={this.handleGuestLogin}
            >
              LOG IN AS GUEST
            </Button>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Login;

Login.propTypes = {
  userRegistered: PropTypes.bool,
};
