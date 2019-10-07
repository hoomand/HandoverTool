import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setHeaderTitle } from "../../redux/actions/headerActions";

class Users extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Users");
  }
  render() {
    return <div>Users are here!</div>;
  }
}

Users.propTypes = {
  setHeaderTitle: PropTypes.func
};

export default connect(
  null,
  { setHeaderTitle }
)(Users);
