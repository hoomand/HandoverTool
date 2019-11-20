import React, { Component } from "react";
import PropTypes from "prop-types";
import { listStyles } from "../layout/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
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
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

import moment from "moment";

import { connect } from "react-redux";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getUsers } from "../../redux/actions/userActions";
import { getConfigs } from "../../redux/actions/configActions";

import { getSorting, stableSort } from "../../utils/Utils";

/* eslint-disable react/display-name */
const ComponentLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

class List extends Component {
  state = {
    order: "desc",
    orderBy: "entryDate",
    page: 0,
    rowsPerPage: 5,
    searchInput: ""
  };

  componentDidMount() {
    this.props.getConfigs();
    this.props.setHeaderTitle("Users");
    this.props.getUsers();
  }

  onSearchInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangePage = (_event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  handleRequestSort = property => {
    const isDesc =
      this.state.orderBy === property && this.state.order === "desc";
    this.setState({ order: isDesc ? "asc" : "desc" });
    this.setState({ orderBy: property });
  };

  filteredUsers = allUsers => {
    const filteredUsers = [];
    const searchInput = this.state.searchInput.toLocaleLowerCase();
    for (let user in allUsers) {
      const { alias, entryDate, updated_at } = allUsers[user];
      if (
        alias.toLocaleLowerCase().includes(searchInput) ||
        moment(entryDate).format("YYYY-MM-DD") === searchInput ||
        moment(updated_at).format("YYYY-MM-DD") === searchInput
      ) {
        filteredUsers.push(allUsers[user]);
      }
    }
    return filteredUsers;
  };

  showUser = userAlias => {
    const { configs } = this.props;
    const { isAuthenticated, user } = this.props.auth;
    const { adminUsers } = configs.data;

    if (isAuthenticated && adminUsers && adminUsers.includes(user.alias)) {
      return (
        <Link
          component={ComponentLink}
          to={`/users/${userAlias}/stats`}
          variant="inherit"
          color="inherit"
        >
          {userAlias}
        </Link>
      );
    } else {
      return userAlias;
    }
  };

  dataDisplay = (users, classes) => {
    const { page, rowsPerPage } = this.state;
    if (users.length === 0) {
      return (
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No users for this project yet
          </Typography>
        </div>
      );
    } else {
      const HEADERS = [
        { key: "alias", value: "User Alias" },
        { key: "entryDate", value: "Creation Date" },
        { key: "updated_at", value: "Update Date" }
      ];
      const filteredUsers = this.filteredUsers(Object.values(users));
      return (
        <div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {HEADERS.map(header => {
                  const { key, value } = header;
                  return (
                    <TableCell
                      key={key}
                      sortDirection={
                        this.state.orderBy === key ? this.state.order : false
                      }
                    >
                      <TableSortLabel
                        active={this.state.orderBy === key}
                        direction={this.state.order}
                        onClick={() => this.handleRequestSort(key)}
                      >
                        {value}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(
                filteredUsers,
                getSorting(this.state.order, this.state.orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => {
                  return (
                    <TableRow key={user.alias}>
                      <TableCell component="th" scope="row">
                        {this.showUser(user.alias)}
                      </TableCell>
                      <TableCell>
                        {moment(user.entryDate).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        {moment(user.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            backIconButtonProps={{
              "aria-label": "previous page"
            }}
            nextIconButtonProps={{
              "aria-label": "next page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>
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
            <Grid container spacing={2}>
              <Grid item>
                <SearchIcon className={classes.block} color="inherit" />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  name="searchInput"
                  placeholder="Search by user alias or date"
                  InputProps={{
                    disableUnderline: true,
                    className: classes.searchInput
                  }}
                  onChange={this.onSearchInput}
                />
              </Grid>
              <Grid item>
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
  getConfigs: PropTypes.func,
  users: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  configs: PropTypes.object,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,
  configs: state.configs
});

export default connect(
  mapStateToProps,
  { setHeaderTitle, getUsers, getConfigs }
)(withStyles(listStyles)(List));
