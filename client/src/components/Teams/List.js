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
import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getTeams } from "../../redux/actions/teamActions";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

/* eslint-disable react/display-name */
const ComponentLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

class List extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Teams");
    this.props.getTeams();
  }

  dataDisplay = (teams, classes) => {
    if (teams.length === 0) {
      return (
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No teams for this project yet
          </Typography>
        </div>
      );
    } else {
      return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Created By</TableCell>
              <TableCell align="right">Creation Date</TableCell>
              <TableCell align="right">Update Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(team => (
              <TableRow key={team.name}>
                <TableCell component="th" scope="row">
                  {team.name}
                </TableCell>
                <TableCell align="right">{team.created_by_alias}</TableCell>
                <TableCell align="right">
                  {moment(team.entryDate).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell align="right">
                  {moment(team.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
  };

  render() {
    const { classes, teams } = this.props;

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
                  placeholder="Search by email address, phone number, or user UID"
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
                    to="/teams/create"
                    variant="inherit"
                    color="inherit"
                  >
                    Add Team
                  </Link>
                </Button>
                <Tooltip title="Reload">
                  <IconButton>
                    <RefreshIcon
                      className={classes.block}
                      color="inherit"
                      onClick={() => this.props.getTeams()}
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {this.dataDisplay(teams.data, classes)}
      </Paper>
    );
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired,
  setHeaderTitle: PropTypes.func,
  getTeams: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  teams: state.teams
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getTeams }
)(withStyles(listStyles)(List));
