import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { setHeaderTitle } from "../../redux/actions/headerActions";

class Show extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Handovers - Show");
  }
  render() {
    const { id: handoverId } = this.props.match.params;
    return <div>jooosh - {handoverId}</div>;
  }
}

Show.propTypes = {
  handoverId: PropTypes.string,
  match: PropTypes.object.isRequired,
  setHeaderTitle: PropTypes.func
};

export default connect(
  null,
  { setHeaderTitle }
)(withRouter(withStyles(listStyles)(Show)));
