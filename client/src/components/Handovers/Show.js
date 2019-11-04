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
import Badge from "@material-ui/core/Badge";

import moment from "moment";
import HandoverItem from "./HandoverItem";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getHandover } from "../../redux/actions/handoverActions";

class Show extends Component {
  componentDidMount() {
    const { id: handoverId } = this.props.match.params;
    this.props.setHeaderTitle("Handovers - Show");
    this.props.getHandover(handoverId);
  }

  _itemsBadgeColor = length => {
    return length < 5 ? "primary" : "secondary";
  };

  dataDisplay = (handovers, id, classes) => {
    if (handovers.length !== 0 && handovers[id]) {
      const handover = handovers[id];
      return (
        <Grid container style={{ marginTop: 10 }}>
          <Paper className={classes.paper} style={{ width: "100%" }}>
            <Grid container style={{ textAlign: "center", padding: "20px" }}>
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
            </Grid>
          </Paper>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{ marginTop: 10 }}>
              <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Badge
                        className={classes.badePadding}
                        color={this._itemsBadgeColor(handover.items.length)}
                        badgeContent={handover.items.length}
                      >
                        <strong>Items</strong>
                      </Badge>
                    </Grid>
                  </Grid>
                </Toolbar>
              </AppBar>
            </Paper>

            <Grid container>
              {handover.items.map((item, index) => {
                const { userAlias, entryDate } = handover;
                return (
                  <React.Fragment key={index}>
                    <HandoverItem
                      value={item}
                      title={userAlias}
                      subheader={moment(entryDate).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    />
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
                  <strong>Details</strong>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Paper>

        <Grid container>{this.dataDisplay(handovers.data, id, classes)}</Grid>
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
