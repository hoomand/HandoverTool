import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { default as UserStatsWrapper } from "./components/Users/UserStatsWrapper";
import { default as UsersList } from "./components/Users/List";
import { default as TeamsList } from "./components/Teams/List";
import { default as TeamCreate } from "./components/Teams/Create";
import { default as HandoversList } from "./components/Handovers/List";
import { default as HandoverCreate } from "./components/Handovers/Create";
import { default as HandoverShow } from "./components/Handovers/Show";

import { connect } from "react-redux";
import { getConfigs } from "./redux/actions/configActions";

class Routes extends Component {
  componentDidMount() {
    this.props.getConfigs();
  }

  adminRoutes() {
    const { isAuthenticated, user } = this.props.auth;
    const { configs } = this.props;
    const { adminUsers } = configs.data;
    if (isAuthenticated && adminUsers && adminUsers.includes(user.alias)) {
      return (
        <React.Fragment>
          <Route exact path="/teams/create" component={TeamCreate} />
          <Route
            exact
            path="/users/:alias/stats"
            component={UserStatsWrapper}
          />
        </React.Fragment>
      );
    }
  }

  loggedInUserRoutes() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      return (
        <React.Fragment>
          <Route exact path="/handovers/create" component={HandoverCreate} />
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={HandoversList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/users" component={UsersList} />
        <Route exact path="/teams" component={TeamsList} />

        {this.adminRoutes()}
        {this.loggedInUserRoutes()}

        <Route exact path="/handovers" component={HandoversList} />
        <Route exact path="/handovers/show/:id" component={HandoverShow} />
      </React.Fragment>
    );
  }
}

Routes.propTypes = {
  getConfigs: PropTypes.func,
  configs: PropTypes.object,
  auth: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  configs: state.configs
});

export default connect(
  mapStateToProps,
  { getConfigs }
)(Routes);
