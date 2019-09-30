import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import Content from "./components/layout/Content";
import Users from "./components/auth/Users";
import Register from "./components/auth/Register";

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={Content} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/users" component={Users} />
      </React.Fragment>
    );
  }
}

export default Routes;
