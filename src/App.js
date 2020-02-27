import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Auth from "./Auth";
import { Switch, Redirect, Route, withRouter } from "react-router-dom";

import "./App.css";
import NavBar from "./NavBar";

class App extends React.Component {
  state = {
    user: {},
    loggedIn: false,
    error: ""
  };

  componentDidMount() {
    if (Auth.isUserAuthenticated()) {
      fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
        .then(res => res.json())
        .then(user => {
          this.setState({ loggedIn: true, user });
        });
    }
  }

  signIn = user => {
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(r => r.json())
      .then(user => {
        if (user.jwt) {
          Auth.authenticateToken(user.jwt);
          this.setState({ loggedIn: true, user }, () => {
            this.props.history.push("/");
          });
        }
      });
  };

  signUp = user => {
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(r => r.json())
      .then(user => {
        if (user.jwt) {
          Auth.authenticateToken(user.jwt);
          this.setState({ loggedIn: true, user }, () => {
            this.props.history.push("/");
          });
        }
      });
  };

  render() {
    console.log(this.props.history);

    return (
      <div className="App">
        <NavBar />
        <Switch>
          <Route
            path="/signup"
            render={() =>
              this.state.loggedIn ? (
                <div>{this.props.history.push("/")}</div>
              ) : (
                <Signup signUp={this.signUp} />
              )
            }
          />
          <Route
            path="/login"
            render={() =>
              this.state.loggedIn ? (
                <div>{this.props.history.push("/")}</div>
              ) : (
                <Login signIn={this.signIn} />
              )
            }
          />

          <Route
            path="/"
            render={() =>
              this.state.loggedIn ? (
                <div>
                  <Home {...this.state.user} />
                </div>
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
