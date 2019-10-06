import React, { Component } from "react";
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

export default connect(
  null,
  { setHeaderTitle }
)(Users);
