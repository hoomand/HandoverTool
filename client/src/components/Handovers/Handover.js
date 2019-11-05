import React, { Component } from "react";

import PropTypes from "prop-types";
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

class Handover extends Component {
  _itemsBadgeColor = length => {
    return length < 5 ? "primary" : "secondary";
  };

  dataDisplay = (
    handingOverTeam,
    handedOverTeam,
    items,
    creator,
    entryDate,
    classes
  ) => {
    if (items.length !== 0) {
      return (
        <Grid container style={{ marginTop: 10 }}>
          <Paper className={classes.paper} style={{ width: "100%" }}>
            <Grid container style={{ textAlign: "center", padding: "20px" }}>
              <Grid item xs={3}>
                <strong>Handing Over Team:</strong>
              </Grid>
              <Grid item xs={3}>
                {handingOverTeam}
              </Grid>

              <Grid item xs={3}>
                <strong>Handed Over Team:</strong>
              </Grid>
              <Grid item xs={3}>
                {handedOverTeam}
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
                        color={this._itemsBadgeColor(items.length)}
                        badgeContent={items.length}
                      >
                        <strong>Items</strong>
                      </Badge>
                    </Grid>
                  </Grid>
                </Toolbar>
              </AppBar>
            </Paper>

            <Grid container>
              {items.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <HandoverItem
                      value={item}
                      title={creator}
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
    } else {
      return (
        <Grid container style={{ marginTop: 10 }}>
          <Paper className={classes.paper} style={{ width: "100%" }}>
            <Grid container style={{ textAlign: "center", padding: "20px" }}>
              <Grid item>Handover item does not exist</Grid>
            </Grid>
          </Paper>
        </Grid>
      );
    }
  };
  render() {
    const {
      handingOverTeam,
      handedOverTeam,
      items,
      creator,
      entryDate,
      classes
    } = this.props;
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

        <Grid container>
          {this.dataDisplay(
            handingOverTeam,
            handedOverTeam,
            items,
            creator,
            entryDate,
            classes
          )}
        </Grid>
      </Container>
    );
  }
}

Handover.propTypes = {
  handingOverTeam: PropTypes.string,
  handedOverTeam: PropTypes.string,
  items: PropTypes.array,
  creator: PropTypes.string,
  entryDate: PropTypes.string,
  readOnly: PropTypes.bool,
  classes: PropTypes.object
};

Handover.defaultProps = {
  readOnly: false,
  items: []
};

export default withRouter(withStyles(listStyles)(Handover));
