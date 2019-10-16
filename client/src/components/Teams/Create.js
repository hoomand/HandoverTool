import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import TextFieldGroup from "../common/TextFieldGroup";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { setHeaderTitle } from "../../redux/actions/headerActions";

class Create extends Component {
  state = {
    teamName: "",
    errors: {}
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.props.setHeaderTitle("Teams - New Team");
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <Container component="main" maxWidth="8">
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
                  error={errors.alias}
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
  classes: PropTypes.object
};

export default connect(
  null,
  { setHeaderTitle }
)(withStyles(listStyles)(Create));
