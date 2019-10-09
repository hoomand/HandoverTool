import { Route } from "react-router-dom";
import React, { Component } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { default as UsersList } from "./components/Users/List";

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={UsersList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/users" component={UsersList} />
      </React.Fragment>
    );
  }
}

export default Routes;
