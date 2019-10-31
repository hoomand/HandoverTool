import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getHandover } from "../../redux/actions/handoverActions";

class Show extends Component {
  componentDidMount() {
    const { id: handoverId } = this.props.match.params;
    this.props.setHeaderTitle("Handovers - Show");
    this.props.getHandover(handoverId);
  }
  render() {
    const { id: handoverId } = this.props.match.params;
    return <div>jooosh - {handoverId}</div>;
  }
}

Show.propTypes = {
  handoverId: PropTypes.string,
  match: PropTypes.object.isRequired,
  setHeaderTitle: PropTypes.func,
  getHandover: PropTypes.func.isRequired
};

export default connect(
  null,
  { setHeaderTitle, getHandover }
)(withRouter(withStyles(listStyles)(Show)));
