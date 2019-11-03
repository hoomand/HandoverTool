import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { listStyles } from "../layout/styles";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

class HandoverItem extends Component {
  render() {
    const { classes, title, subheader } = this.props;
    const { link, status, description } = this.props.value;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              T
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={title}
          subheader={subheader}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <strong>Link</strong>
            </Grid>
            <Grid item xs={10}>
              {link}
            </Grid>
            <Grid item xs={2}>
              <strong>Status</strong>
            </Grid>
            <Grid item xs={10}>
              {status}
            </Grid>
            <Grid item xs={2}>
              <strong>Description</strong>
            </Grid>
            <Grid item xs={10}>
              <Typography paragraph>{description}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

HandoverItem.propTypes = {
  classes: PropTypes.object,
  value: PropTypes.object,
  link: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  description: PropTypes.string,
  title: PropTypes.string,
  subheader: PropTypes.string
};

export default withStyles(listStyles)(HandoverItem);
