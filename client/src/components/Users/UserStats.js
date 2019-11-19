import React, { Component } from "react";

import axios from "axios";
import PropTypes from "prop-types";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class UserStats extends Component {
  state = {
    alias: "",
    stats: {
      totalHandoverItemsTypes: {}
    }
  };

  async getStats(alias) {
    this.setState({ alias: alias });
    const response = await axios.get(`/api/users/${alias}/stats`);
    this.setState({ stats: response.data });
  }

  componentDidMount() {
    const { alias } = this.props;
    this.getStats(alias);
  }

  componentDidUpdate(prevProps) {
    if (this.props.alias !== prevProps.alias) {
      this.getStats(this.props.alias);
    }
  }

  render() {
    const { classes } = this.props;
    const { alias, stats } = this.state;
    const {
      totalHandoverSessions,
      totalHandoverItems,
      totalHandoverItemsTypes
    } = stats;

    const {
      fresh = 0,
      investigated = 0,
      diagnosed = 0,
      monitor = 0
    } = totalHandoverItemsTypes;
    return (
      <Container component="main" maxWidth="lg">
        <Paper className={classes.paper}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <strong>{alias}</strong>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Paper>

        <Grid container style={{ marginTop: 10 }}>
          <Paper className={classes.paper} style={{ width: "100%" }}>
            <Grid container style={{ padding: "20px" }}>
              <Grid item xs={5} style={{ paddingBottom: "10px" }}>
                Total Oncall Sessions
              </Grid>
              <Grid item xs={7}>
                {totalHandoverSessions}
              </Grid>
              <Grid item xs={5} style={{ paddingBottom: "10px" }}>
                Total Handover Items
              </Grid>
              <Grid item xs={7}>
                {totalHandoverItems}
              </Grid>
            </Grid>
          </Paper>
          <Grid item xs={12} style={{ marginTop: 10 }}>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <strong>Items Breakdown</strong>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid item xs={5}>
                    Fresh
                  </Grid>
                  <Grid item xs={7}>
                    {fresh}
                  </Grid>
                  <Grid item xs={5}>
                    Investigated
                  </Grid>
                  <Grid item xs={7}>
                    {investigated}
                  </Grid>
                  <Grid item xs={5}>
                    Diagnosed
                  </Grid>
                  <Grid item xs={7}>
                    {diagnosed}
                  </Grid>
                  <Grid item xs={5}>
                    Monitor Only
                  </Grid>
                  <Grid item xs={7}>
                    {monitor}
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

UserStats.propTypes = {
  classes: PropTypes.object,
  alias: PropTypes.string.isRequired
};

export default withStyles(listStyles)(UserStats);
