import React, { Component } from "react";
import PropTypes from "prop-types";

import UsersCombo from "../Users/UsersCombo";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { connect } from "react-redux";
import UserStats from "../Users/UserStats";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { listStyles } from "../layout/styles";

class Analytics extends Component {
  state = {
    selectedUser: ""
  };

  componentDidMount() {
    this.props.setHeaderTitle("Analytics");
  }

  onUserChange = selectedUser => {
    this.setState({ selectedUser: selectedUser });
  };

  showStats = () => {
    const { selectedUser } = this.state;
    const { classes } = this.props;

    if (selectedUser === "") {
      return (
        <Container component="main" maxWidth="lg">
          <Paper className={classes.paper}>
            <AppBar position="static" color="default" elevation={0}>
              <Toolbar>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    Select a user alias first
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Paper>
        </Container>
      );
    } else {
      return <UserStats alias={selectedUser} />;
    }
  };
  render() {
    return (
      <Container component="main" maxWidth="lg">
        <Grid container>
          <Grid item>
            <UsersCombo onUserChange={this.onUserChange} />
          </Grid>
          <Grid item>{this.showStats()}</Grid>
        </Grid>
      </Container>
    );
  }
}

Analytics.propTypes = {
  setHeaderTitle: PropTypes.func,
  classes: PropTypes.object
};

export default connect(
  null,
  { setHeaderTitle }
)(withStyles(listStyles)(Analytics));
