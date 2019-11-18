import React, { Component } from "react";
import PropTypes from "prop-types";

import UsersCombo from "../Users/UsersCombo";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { connect } from "react-redux";

class Analytics extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Analytics");
  }
  render() {
    return (
      <div>
        <UsersCombo />
      </div>
    );
  }
}

Analytics.propTypes = {
  setHeaderTitle: PropTypes.func
};

export default connect(
  null,
  { setHeaderTitle }
)(Analytics);
