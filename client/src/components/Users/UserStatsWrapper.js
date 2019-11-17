import React, { Component } from "react";

import PropTypes from "prop-types";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { connect } from "react-redux";
import UserStats from "./UserStats";

class UserStatsWrapper extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Users - Statistics");
  }
  render() {
    const { alias } = this.props.match.params;
    return <UserStats alias={alias} />;
  }
}

UserStatsWrapper.propTypes = {
  setHeaderTitle: PropTypes.func,
  match: PropTypes.object.isRequired,
  alias: PropTypes.string
};

export default connect(
  null,
  { setHeaderTitle }
)(UserStatsWrapper);
