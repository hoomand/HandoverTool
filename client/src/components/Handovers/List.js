import React, { Component } from "react";
import PropTypes from "prop-types";
import { listStyles } from "../layout/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import moment from "moment";
import { connect } from "react-redux";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getHandovers } from "../../redux/actions/handoverActions";

/* eslint-disable react/display-name */
const ComponentLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

class List extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Handovers");
    this.props.getHandovers();
  }

  dataDisplay = (handovers, classes) => {
    if (handovers.length === 0) {
      return (
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No handovers yet!
          </Typography>
        </div>
      );
    } else {
      return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>From Team</TableCell>
              <TableCell>To Team</TableCell>
              <TableCell>Operator</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Creation Date</TableCell>
              <TableCell align="right">Update Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(handovers).map(handover => {
              return (
                <TableRow key={handover.id}>
                  <TableCell component="th" scope="row">
                    <Link
                      component={ComponentLink}
                      to={`/handovers/${handover.id}`}
                      // to="/handovers/show"
                      variant="inherit"
                      color="inherit"
                    >
                      {handover.handingOverTeam}
                    </Link>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {handover.handedOverTeam}
                  </TableCell>

                  <TableCell align="right">{handover.userAlias}</TableCell>
                  <TableCell align="right">{handover.items.length}</TableCell>

                  <TableCell align="right">
                    {moment(handover.entryDate).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                  <TableCell align="right">
                    {moment(handover.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }
  };

  render() {
    const { classes, handovers } = this.props;

    return (
      <Paper className={classes.paper}>
        <AppBar
          className={classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon className={classes.block} color="inherit" />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search by team name, alias, number of handovers"
                  InputProps={{
                    disableUnderline: true,
                    className: classes.searchInput
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addRow}
                >
                  <Link
                    component={ComponentLink}
                    to="/handovers/create"
                    variant="inherit"
                    color="inherit"
                  >
                    New Handover
                  </Link>
                </Button>
                <Tooltip title="Reload">
                  <IconButton onClick={() => this.props.getHandovers()}>
                    <RefreshIcon className={classes.block} color="inherit" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {this.dataDisplay(handovers.data, classes)}
      </Paper>
    );
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired,
  setHeaderTitle: PropTypes.func,
  getHandovers: PropTypes.func.isRequired,
  handovers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  handovers: state.handovers
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getHandovers }
)(withStyles(listStyles)(List));
