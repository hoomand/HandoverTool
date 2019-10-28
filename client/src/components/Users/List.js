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
import { getUsers } from "../../redux/actions/userActions";

class List extends Component {
  componentDidMount() {
    this.props.setHeaderTitle("Users");
    this.props.getUsers();
  }

  dataDisplay = (users, classes) => {
    if (users.length === 0) {
      return (
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No users for this project yet
          </Typography>
        </div>
      );
    } else {
      return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>User Alias</TableCell>
              <TableCell align="right">Creation Date</TableCell>
              <TableCell align="right">Update Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.alias}>
                <TableCell component="th" scope="row">
                  {user.alias}
                </TableCell>
                <TableCell align="right">
                  {moment(user.entryDate).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell align="right">
                  {moment(user.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
  };

  render() {
    const { classes, users } = this.props;

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
                  Add user
                </Button>
                <Tooltip title="Reload">
                  <IconButton onClick={() => this.props.getUsers()}>
                    <RefreshIcon className={classes.block} color="inherit" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {this.dataDisplay(users.data, classes)}
      </Paper>
    );
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired,
  setHeaderTitle: PropTypes.func,
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getUsers }
)(withStyles(listStyles)(List));
