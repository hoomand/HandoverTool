import React, { Component } from "react";

import PropTypes from "prop-types";
import { listStyles } from "../layout/styles";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import SelectFieldGroup from "../common/SelectFieldGroup";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import { IconButton } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

import isEmpty from "../../utils/is-empty";
import moment from "moment";
import HandoverItem from "./HandoverItem";

class Handover extends Component {
  state = {
    handingOverTeam: "",
    handedOverTeam: "",
    items: [this._emptyItem()],
    errors: {}
  };

  _emptyItem() {
    return {
      status: "",
      link: "",
      description: ""
    };
  }

  _updateItems = (e, index) => {
    const updatedItems = this.state.items.map((item, j) => {
      if (j === index) {
        item[e.target.name] = e.target.value;
      }
      return item;
    });
    this.setState({ items: updatedItems });
  };
  onTeamChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  _addItem = e => {
    e.preventDefault();
    const newItems = [...this.state.items, this._emptyItem()];
    this.setState({ items: newItems });
  };

  _removeItem = index => {
    if (this.state.items.length === 1) return false;
    const newItems = this.state.items;
    newItems.splice(index, 1);
    this.setState({ items: newItems });
  };

  _itemsBadgeColor = length => {
    return length < 5 ? "primary" : "secondary";
  };

  isNewHandover = () => {
    if (this.props.type === "create") {
      return true;
    }
    return false;
  };

  dataDisplay = (
    handingOverTeam,
    handedOverTeam,
    items,
    creator,
    entryDate,
    teams,
    errors,
    onSubmit,
    classes
  ) => {
    let sourceTeam = (
      <React.Fragment>
        <Grid item xs={3}>
          <strong>Handing Over Team:</strong>
        </Grid>
        <Grid item xs={3}>
          {handingOverTeam}
        </Grid>
      </React.Fragment>
    );

    let targetTeam = (
      <React.Fragment>
        <Grid item xs={3}>
          <strong>Handed Over Team:</strong>
        </Grid>
        <Grid item xs={3}>
          {handedOverTeam}
        </Grid>
      </React.Fragment>
    );

    let addItemButton = "";
    let submitButton = "";

    if (this.isNewHandover()) {
      sourceTeam = (
        <React.Fragment>
          <Grid item xs={5}>
            <SelectFieldGroup
              id="handingOverTeam-name"
              label="Handing Over Team"
              name="handingOverTeam"
              value={this.state.handingOverTeam}
              options={teams}
              helperText="The source team handing over the shift"
              onChange={this.onTeamChange}
              error={errors.handingOverTeam}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </React.Fragment>
      );

      targetTeam = (
        <Grid item xs={5}>
          <SelectFieldGroup
            id="handedOverTeam-name"
            label="Handed Over Team"
            name="handedOverTeam"
            value={this.state.handedOverTeam}
            options={teams}
            helperText="The target team accepting the handover"
            onChange={this.onTeamChange}
            error={errors.handedOverTeam}
          />
        </Grid>
      );

      items = this.state.items;

      addItemButton = (
        <Grid item>
          <IconButton color="inherit" onClick={this._addItem}>
            <Icon className="fas fa-plus-circle" />
          </IconButton>
        </Grid>
      );

      submitButton = (
        <Grid
          container
          spacing={3}
          justify="flex-end"
          style={{ paddingTop: 20 }}
        >
          <Grid item xs={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={e => onSubmit(e, this.state)}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      );
    }
    if (items.length !== 0 || this.isNewHandover()) {
      return (
        <Grid container style={{ marginTop: 10 }}>
          <Paper className={classes.paper} style={{ width: "100%" }}>
            <Grid container style={{ textAlign: "center", padding: "20px" }}>
              {sourceTeam}
              {targetTeam}
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
                    {addItemButton}
                  </Grid>
                </Toolbar>
              </AppBar>
            </Paper>

            <Grid container>
              {items.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <HandoverItem
                      key={index}
                      value={item}
                      title={creator}
                      subheader={moment(entryDate).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                      readOnly={!this.isNewHandover()}
                      onChange={
                        this.isNewHandover()
                          ? e => this._updateItems(e, index)
                          : null
                      }
                      error={
                        !isEmpty(errors) && errors.index === index
                          ? errors
                          : null
                      }
                      onClick={
                        this.isNewHandover()
                          ? () => {
                              this._removeItem(index);
                            }
                          : null
                      }
                    />
                  </React.Fragment>
                );
              })}
            </Grid>
          </Grid>
          {submitButton}
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
      teams,
      errors,
      onSubmit,
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
            teams,
            errors,
            onSubmit,
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
  type: PropTypes.oneOf(["show", "create"]),
  teams: PropTypes.object,
  errors: PropTypes.object,
  classes: PropTypes.object,
  onSubmit: PropTypes.func
};

Handover.defaultProps = {
  type: "show",
  items: []
};

export default withRouter(withStyles(listStyles)(Handover));
