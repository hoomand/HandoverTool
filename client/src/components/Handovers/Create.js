import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SelectFieldGroup from "../common/SelectFieldGroup";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getTeams } from "../../redux/actions/teamActions";

class Create extends Component {
  state = {
    handingOverTeam: "",
    handedOverTeam: "",
    items: [],
    errors: {}
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const handoverData = {
      handingOverTeam: this.state.handingOverTeam,
      handedOverTeam: this.state.handedOverTeam,
      items: this.state.items
    };
    console.log(handoverData);

    // this.props.createTeam(teamData, this.props.history);
  };

  componentDidMount() {
    this.props.setHeaderTitle("Handovers - New Handover");
    this.props.getTeams();

    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { classes, teams } = this.props;
    const { errors } = this.state;
    let teamNames = [];
    teams.data.forEach(team => teamNames.push(team.name));

    return (
      <Container component="main" maxWidth="lg">
        <Paper className={classes.paper}>
          <AppBar
            className={classes.searchBar}
            position="static"
            color="default"
            elevation={0}
          >
            <Toolbar>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  New Handover
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <form noValidate onSubmit={this.onSubmit}>
            <Grid container spacing={3} justify="flex-end">
              <Grid item xs={12}>
                <SelectFieldGroup
                  id="handingOverTeam-name"
                  label="Handing Over Team"
                  name="handingOverTeam"
                  value={this.state.handingOverTeam}
                  options={teamNames}
                  helperText="The source team handing over the shift"
                  onChange={this.onChange}
                  error={errors.handingOverTeam}
                />
              </Grid>

              <Grid item xs={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
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
  teams: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
  teams: state.teams
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getTeams }
)(withRouter(withStyles(listStyles)(Create)));
