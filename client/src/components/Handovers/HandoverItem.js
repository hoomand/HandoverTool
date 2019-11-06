import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { listStyles } from "../layout/styles";

import { capitalize } from "../../utils/Utils";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import SelectFieldGroup from "../common/SelectFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import Icon from "@material-ui/core/Icon";

import isEmpty from "../../utils/is-empty";
import { getConfigs } from "../../redux/actions/configActions";

class HandoverItem extends Component {
  componentDidMount() {
    this.props.getConfigs();
  }

  _renderItem = item => {
    const { link, status, description } = item;
    if (this.props.readOnly) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <strong>Status</strong>
          </Grid>
          <Grid item xs={10}>
            {capitalize(status)}
          </Grid>
          <Grid item xs={2}>
            <strong>Link</strong>
          </Grid>
          <Grid item xs={10}>
            {link}
          </Grid>
          <Grid item xs={2}>
            <strong>Description</strong>
          </Grid>
          <Grid item xs={10}>
            <Typography paragraph>{capitalize(description)}</Typography>
          </Grid>
        </Grid>
      );
    } else {
      const { handoverItem } = this.props.configs.data;
      const { error } = this.props;
      const validStatuses = !isEmpty(handoverItem)
        ? handoverItem.validStatuses
        : {};

      return (
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <SelectFieldGroup
              id="status"
              label="Status"
              name="status"
              value={status}
              options={validStatuses}
              helperText="how much progress was on the handover item?"
              onChange={e => this.props.onChange(e)}
              error={
                error !== null && error.section === "status"
                  ? error.handoverItems
                  : null
              }
              style={{ width: "100%", margin: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFieldGroup
              id="link"
              label="Link"
              name="link"
              value={link}
              autoComplete="link"
              helperText="URL to the problem in ticketing portal"
              onChange={e => this.props.onChange(e)}
              error={
                error !== null && error.section === "link"
                  ? error.handoverItems
                  : null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextFieldGroup
              id="description"
              label="Description"
              name="description"
              required={false}
              value={description}
              autoComplete="description"
              helperText="Any explanation to clarify the situation"
              onChange={e => this.props.onChange(e)}
            />
          </Grid>
        </Grid>
      );
    }
  };
  render() {
    const { classes, title, subheader, readOnly, onClick } = this.props;
    let removeItemButton = "";
    if (!readOnly) {
      removeItemButton = (
        <IconButton color="inherit" onClick={onClick}>
          <Icon className="fas fa-minus-circle" />
        </IconButton>
      );
    }
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              T
            </Avatar>
          }
          action={removeItemButton}
          title={title}
          subheader={subheader}
        />
        <CardContent>{this._renderItem(this.props.value)}</CardContent>
      </Card>
    );
  }
}

HandoverItem.propTypes = {
  classes: PropTypes.object,
  value: PropTypes.object,
  link: PropTypes.string,
  status: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  subheader: PropTypes.string,
  readOnly: PropTypes.bool,
  error: PropTypes.object,
  configs: PropTypes.object,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  getConfigs: PropTypes.func
};

HandoverItem.defaultProps = {
  readOnly: true
};

const mapStateToProps = state => ({
  configs: state.configs
});

export default connect(
  mapStateToProps,
  { getConfigs }
)(withStyles(listStyles)(HandoverItem));
