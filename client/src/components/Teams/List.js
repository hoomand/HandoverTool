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
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

import moment from "moment";
import { connect } from "react-redux";
import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getTeams } from "../../redux/actions/teamActions";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

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
    rowsPerPage: 10,
    searchInput: ""
  };

  componentDidMount() {
    this.props.setHeaderTitle("Teams");
    this.props.getTeams();
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
  filteredTeams = allTeams => {
    const filteredTeams = [];
    const searchInput = this.state.searchInput.toLocaleLowerCase();
    for (let team in allTeams) {
      const { name, created_by_alias, entryDate, updated_at } = allTeams[team];
      if (
        name.toLocaleLowerCase().includes(searchInput) ||
        created_by_alias.toLocaleLowerCase().includes(searchInput) ||
        moment(entryDate).format("YYYY-MM-DD") === searchInput ||
        moment(updated_at).format("YYYY-MM-DD") === searchInput
      ) {
        filteredTeams.push(allTeams[team]);
      }
    }
    return filteredTeams;
  };

  dataDisplay = (teams, classes) => {
    const { page, rowsPerPage } = this.state;

    if (teams.length === 0) {
      return (
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No teams for this project yet
          </Typography>
        </div>
      );
    } else {
      const HEADERS = [
        { key: "name", value: "Name" },
        { key: "created_by_alias", value: "Created By" },
        { key: "entryDate", value: "Creation Date" },
        { key: "updated_at", value: "Update Date" }
      ];
      const filteredTeams = this.filteredTeams(Object.values(teams));
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
                filteredTeams,
                getSorting(this.state.order, this.state.orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(team => {
                  return (
                    <TableRow key={team.name}>
                      <TableCell component="th" scope="row">
                        {team.name}
                      </TableCell>
                      <TableCell>{team.created_by_alias}</TableCell>
                      <TableCell>
                        {moment(team.entryDate).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        {moment(team.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredTeams.length}
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
                  name="searchInput"
                  placeholder="Search by team name, creating user or create/update date"
                  InputProps={{
                    disableUnderline: true,
                    className: classes.searchInput
                  }}
                  onChange={this.onSearchInput}
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
                  <IconButton onClick={() => this.props.getTeams()}>
                    <RefreshIcon className={classes.block} color="inherit" />
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
