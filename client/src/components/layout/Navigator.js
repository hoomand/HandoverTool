import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import TimerIcon from "@material-ui/icons/Timer";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonAdd from "@material-ui/icons/PersonAdd";
import VpnKey from "@material-ui/icons/VpnKey";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

/* eslint-disable react/display-name */
const ComponentLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)"
    }
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white
  },
  itemActiveItem: {
    color: "#4fc3f7"
  },
  itemPrimary: {
    fontSize: "inherit"
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(2)
  }
});

class Navigator extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { classes, ...other } = this.props;
    const { isAuthenticated } = this.props.auth;

    let links = [
      {
        id: "Operators Area",
        children: [
          { id: "Handovers", url: "/", icon: <HomeIcon />, active: true },
          { id: "New Handover", url: "/", icon: <PeopleIcon /> },
          { id: "Analytics", url: "/", icon: <SettingsIcon /> }
        ]
      },
      {
        id: "Admin Area",
        children: [
          { id: "Analytics", url: "/", icon: <SettingsIcon /> },
          { id: "Performance", url: "/", icon: <TimerIcon /> },
          { id: "Users", url: "/users", icon: <PeopleIcon /> },
          { id: "Teams", url: "/teams", icon: <PeopleIcon /> }
        ]
      }
    ];

    const guestLinks = {
      id: "Authentication",
      children: [
        { id: "Login", url: "/login", icon: <VpnKey /> },
        { id: "Register", url: "/register", icon: <PersonAdd /> }
      ]
    };

    const authorizedLinks = {
      id: "Authentication",
      children: [
        {
          id: "logout",
          url: "/logout",
          icon: <ExitToAppIcon />,
          onClick: e => this.onLogoutClick(e)
        }
      ]
    };

    if (isAuthenticated) {
      links.unshift(authorizedLinks);
    } else {
      links.unshift(guestLinks);
    }

    return (
      <Drawer variant="permanent" {...other}>
        <List disablePadding>
          <ListItem
            className={clsx(
              classes.firebase,
              classes.item,
              classes.itemCategory
            )}
          >
            Handover Tool
          </ListItem>
          {links.map(({ id, children }) => (
            <React.Fragment key={id}>
              <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary
                  }}
                >
                  {id}
                </ListItemText>
              </ListItem>
              {children.map(({ id: childId, url, icon, active, onClick }) => (
                <ListItem
                  key={childId}
                  button
                  className={clsx(
                    classes.item,
                    active && classes.itemActiveItem
                  )}
                >
                  <ListItemIcon className={classes.itemIcon}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary
                    }}
                  >
                    {!onClick ? (
                      <Link
                        component={ComponentLink}
                        to={url}
                        variant="inherit"
                        color="inherit"
                      >
                        {childId}
                      </Link>
                    ) : (
                      <div onClick={onClick}>{childId}</div>
                    )}
                  </ListItemText>
                </ListItem>
              ))}

              <Divider className={classes.divider} />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(styles)(Navigator));
