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
import Icon from "@material-ui/core/Icon";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getTeams } from "../../redux/actions/teamActions";
import { IconButton } from "@material-ui/core";
import Item from "./Item";

class Create extends Component {
  state = {
    handingOverTeam: "",
    handedOverTeam: "",
    items: [this._emptyItem()],
    errors: {}
  };

  _emptyItem() {
    return {
      status: "",
      link: "",
      description: ""
    };
  }

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

  _addItem = e => {
    e.preventDefault();
    const newItems = [...this.state.items, this._emptyItem()];
    this.setState({ items: newItems });
  };

  render() {
    const { classes, teams } = this.props;
    const { errors } = this.state;

    const teamNames = {};
    teams.data.forEach(team => (teamNames[team.name] = team.name));

    return (
      <Container component="main" maxWidth="lg">
        <Paper className={classes.paper}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  New Handover
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <form noValidate onSubmit={this.onSubmit}>
            <Grid container spacing={3} justify="center">
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <SelectFieldGroup
                  id="handedOverTeam-name"
                  label="Handed Over Team"
                  name="handedOverTeam"
                  value={this.state.handedOverTeam}
                  options={teamNames}
                  helperText="The target team accepting the handover"
                  onChange={this.onChange}
                  error={errors.handedOverTeam}
                />
              </Grid>
              <Grid item xs={10}>
                <AppBar position="static" color="default" elevation={0}>
                  <Toolbar>
                    <Grid container alignItems="center">
                      <Grid item xs={11}>
                        <strong>Items</strong>
                      </Grid>
                      <Grid item xs alignSelf="flex-end">
                        <IconButton color="inherit" onClick={this._addItem}>
                          <Icon className="fas fa-plus-circle" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>

                <Grid container style={{ textAlign: "right" }}>
                  {this.state.items.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Grid item xs={10}>
                          <Item value={item} key={index} />
                        </Grid>
                        <Grid item xs alignSelf="flex-end">
                          <IconButton color="inherit" onClick={this.addItem}>
                            <Icon className="fas fa-minus-circle" />
                          </IconButton>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
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
            <Button type="submit" fullWidth variant="contained" color="primary">
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
