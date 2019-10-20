import { Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import PrivateRoute from "./components/common/PrivateRoute";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { default as UsersList } from "./components/Users/List";
import { default as TeamsList } from "./components/Teams/List";
import { default as TeamCreate } from "./components/Teams/Create";
import { default as HandoversList } from "./components/Handovers/List";
import { default as HandoverCreate } from "./components/Handovers/Create";

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={UsersList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/users" component={UsersList} />
        <Route exact path="/teams" component={TeamsList} />
        <Switch>
          <PrivateRoute exact path="/teams/create" component={TeamCreate} />
          <PrivateRoute
            exact
            path="/handovers/create"
            component={HandoverCreate}
          />
        </Switch>
        <Route exact path="/handovers" component={HandoversList} />
      </React.Fragment>
    );
  }
}

export default Routes;
