import { Route } from "react-router-dom";
import React, { Component } from "react";
import Content from "./components/layout/Content";
import Users from "./components/auth/Users";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={Content} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/users" component={Users} />
      </React.Fragment>
    );
  }
}

export default Routes;
