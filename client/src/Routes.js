import { Route } from "react-router-dom";
import React, { Component } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { default as UsersList } from "./components/Users/List";
import { default as TeamsList } from "./components/Teams/List";

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={UsersList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/users" component={UsersList} />
        <Route exact path="/teams" component={TeamsList} />
      </React.Fragment>
    );
  }
}

export default Routes;
