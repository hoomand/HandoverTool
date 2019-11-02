import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getHandover } from "../../redux/actions/handoverActions";

class Show extends Component {
  componentDidMount() {
    const { id: handoverId } = this.props.match.params;
    this.props.setHeaderTitle("Handovers - Show");
    this.props.getHandover(handoverId);
  }
  dataDisplay = (handovers, id) => {
    if (handovers.length !== 0 && handovers[id]) {
      const handover = handovers[id];
      return (
        <Grid
          container
          spacing={3}
          padding={2}
          justify="center"
          style={{ paddingTop: 20, paddingLeft: 20 }}
        >
          <Grid item xs={3}>
            <strong>Handing Over Team:</strong>
          </Grid>
          <Grid item xs={3}>
            {handover.handingOverTeam}
          </Grid>

          <Grid item xs={3}>
            <strong>Handed Over Team:</strong>
          </Grid>
          <Grid item xs={3}>
            {handover.handedOverTeam}
          </Grid>
          <Grid item xs={10}>
            <AppBar position="static" color="default" elevation={0}>
              <Toolbar>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <strong>Items</strong>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>

            <Grid container style={{ textAlign: "right" }}>
              {handover.items.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={12}>
                      {item.link}
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      );
    }
  };
  render() {
    const { handovers, classes } = this.props;
    const { id } = this.props.match.params;
    return (
      <Container component="main" maxWidth="lg">
        <Paper className={classes.paper}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  Handover
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          {this.dataDisplay(handovers.data, id, classes)}
        </Paper>
      </Container>
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
