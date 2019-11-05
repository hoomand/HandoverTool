import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import Handover from "./Handover";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getHandover } from "../../redux/actions/handoverActions";

class Show extends Component {
  componentDidMount() {
    const { id: handoverId } = this.props.match.params;
    this.props.setHeaderTitle("Handovers - Show");
    this.props.getHandover(handoverId);
  }

  dataDisplay = data => {
    if (data !== undefined) {
      let {
        handingOverTeam,
        handedOverTeam,
        items,
        userAlias,
        entryDate
      } = data;

      return (
        <Handover
          handingOverTeam={handingOverTeam}
          handedOverTeam={handedOverTeam}
          items={items}
          creator={userAlias}
          entryDate={entryDate}
        />
      );
    } else {
      return <Handover />;
    }
  };
  render() {
    const { handovers } = this.props;
    const { id } = this.props.match.params;

    return (
      <React.Fragment>{this.dataDisplay(handovers.data[id])}</React.Fragment>
    );
  }
}

Show.propTypes = {
  handoverId: PropTypes.string,
  match: PropTypes.object.isRequired,
  classes: PropTypes.object,
  setHeaderTitle: PropTypes.func,
  getHandover: PropTypes.func.isRequired,
  handovers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  handovers: state.handovers
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getHandover }
)(withRouter(withStyles(listStyles)(Show)));
