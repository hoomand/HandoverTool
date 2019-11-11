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
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { setHeaderTitle } from "../../redux/actions/headerActions";
import { getHandovers } from "../../redux/actions/handoverActions";

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
    this.props.setHeaderTitle("Handovers");
    this.props.getHandovers();
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

  desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => this.desc(a, b, orderBy)
      : (a, b) => -this.desc(a, b, orderBy);
  }

  handleRequestSort = property => {
    const isDesc =
      this.state.orderBy === property && this.state.order === "desc";
    this.setState({ order: isDesc ? "asc" : "desc" });
    this.setState({ orderBy: property });
  };

  filteredHandovers = allHandovers => {
    const filteredHandovers = [];
    const searchInput = this.state.searchInput.toLocaleLowerCase();
    for (let handover in allHandovers) {
      const {
        handingOverTeam,
        handedOverTeam,
        userAlias,
        items,
        entryDate,
        updated_at
      } = allHandovers[handover];
      if (
        handingOverTeam.toLocaleLowerCase().includes(searchInput) ||
        handedOverTeam.toLocaleLowerCase().includes(searchInput) ||
        userAlias.toLocaleLowerCase().includes(searchInput) ||
        items.length.toString() === searchInput ||
        moment(entryDate).format("YYYY-MM-DD") === searchInput ||
        moment(updated_at).format("YYYY-MM-DD") === searchInput
      ) {
        filteredHandovers.push(allHandovers[handover]);
      }
    }
    return filteredHandovers;
  };

  dataDisplay = (handovers, classes) => {
    const { page, rowsPerPage } = this.state;
    if (handovers.length === 0) {
      return (
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No handovers yet!
          </Typography>
        </div>
      );
    } else {
      const HEADERS = [
        { key: "handingOverTeam", value: "From Team" },
        { key: "handedOverTeam", value: "To Team" },
        { key: "userAlias", value: "Operator" },
        { key: "items", value: "items" },
        { key: "entryDate", value: "Creation Date" },
        { key: "updated_at", value: "Update Date" }
      ];
      const filteredHandovers = this.filteredHandovers(
        Object.values(handovers)
      );
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
              {this.stableSort(
                filteredHandovers,
                this.getSorting(this.state.order, this.state.orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(handover => {
                  return (
                    <TableRow key={handover.id}>
                      <TableCell component="th" scope="row">
                        <Link
                          component={ComponentLink}
                          to={`/handovers/show/${handover.id}`}
                          variant="inherit"
                          color="inherit"
                        >
                          {handover.handingOverTeam}
                        </Link>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {handover.handedOverTeam}
                      </TableCell>

                      <TableCell>{handover.userAlias}</TableCell>
                      <TableCell>{handover.items.length}</TableCell>

                      <TableCell>
                        {moment(handover.entryDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </TableCell>
                      <TableCell>
                        {moment(handover.updated_at).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredHandovers.length}
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
                  name="searchInput"
                  placeholder="Search by team name, alias, number of handovers"
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
