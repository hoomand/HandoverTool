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
import TextFieldGroup from "../common/TextFieldGroup";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { createTeam } from "../../redux/actions/teamActions";
import { setHeaderTitle } from "../../redux/actions/headerActions";

class Create extends Component {
  state = {
    teamName: "",
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

    const teamData = {
      name: this.state.teamName
    };

    this.props.createTeam(teamData, this.props.history);
  };

  componentDidMount() {
    this.props.setHeaderTitle("Teams - New Team");

    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
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
                  Create New Team
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <form noValidate onSubmit={this.onSubmit}>
            <Grid container spacing={3} justify="flex-end">
              <Grid item xs={12}>
                <TextFieldGroup
                  id="team-name"
                  label="Name"
                  name="teamName"
                  value={this.state.teamName}
                  autoComplete="name"
                  onChange={this.onChange}
                  error={errors.name}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Grid
          container
          spacing={3}
          justify="flex-end"
          style={{ paddingTop: 20 }}
        >
          <Grid item xs={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={e => this.onSubmit(e)}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Create.propTypes = {
  setHeaderTitle: PropTypes.func,
  classes: PropTypes.object,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createTeam: PropTypes.func.isRequired,
  history: PropTypes.object
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, createTeam }
)(withRouter(withStyles(listStyles)(Create)));
