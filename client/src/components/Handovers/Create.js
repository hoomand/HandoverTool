import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import Handover from "./Handover";
import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getTeams } from "../../redux/actions/teamActions";
import { createHandover } from "../../redux/actions/handoverActions";

class Create extends Component {
  state = {
    errors: {}
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = (e, data) => {
    e.preventDefault();
    const handoverData = {
      handingOverTeam: data.handingOverTeam,
      handedOverTeam: data.handedOverTeam,
      items: data.items
    };

    this.props.createHandover(handoverData, this.props.history);
    console.log(handoverData);
  };

  componentDidMount() {
    this.props.setHeaderTitle("Handovers - New Handover");
    this.props.getTeams();

    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { teams, auth } = this.props;
    const { errors } = this.state;

    const teamNames = {};
    teams.data.forEach(team => (teamNames[team.name] = team.name));

    return (
      <React.Fragment>
        <Handover
          type="create"
          teams={teamNames}
          creator={auth.user.alias}
          errors={errors}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
        />
      </React.Fragment>
    );
  }
}

Create.propTypes = {
  setHeaderTitle: PropTypes.func,
  classes: PropTypes.object,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object,
  getTeams: PropTypes.func.isRequired,
  createHandover: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
  teams: state.teams
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getTeams, createHandover }
)(withRouter(withStyles(listStyles)(Create)));
