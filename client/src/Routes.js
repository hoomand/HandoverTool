import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import Content from "./components/layout/Content";
import Users from "./components/auth/Users";

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={Content} />
        <Route exact path="/users" component={Users} />
      </React.Fragment>
    );
  }
}

export default Routes;
