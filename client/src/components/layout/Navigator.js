import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { logoutUser as logout } from "../../redux/actions/authActions";
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

import { getConfigs } from "../../redux/actions/configActions";

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
  componentDidMount() {
    this.props.getConfigs();
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logout();

    window.location.href = "/login";
  };

  isHeaderActive(title) {
    const headerTitle = this.props.header.headerTitle.toLowerCase();
    if (headerTitle.startsWith(title)) {
      return true;
    }
    return false;
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { classes, logout, getConfigs, configs, ...other } = this.props;
    const { isAuthenticated, user } = this.props.auth;
    const { adminUsers } = configs.data;

    let links = [
      {
        id: "Operators Area",
        children: [
          {
            id: "Handovers",
            url: "/handovers",
            icon: <HomeIcon />
          }
        ]
      }
    ];

    const guestLinks = {
      id: "Authentication",
      children: [
        {
          id: "Login",
          url: "/login",
          icon: <VpnKey />
        },
        {
          id: "Register",
          url: "/register",
          icon: <PersonAdd />
        }
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

    const adminLinks = {
      id: "Admin Area",
      children: [
        {
          id: "Analytics",
          url: "/",
          icon: <SettingsIcon />
        },
        {
          id: "Performance",
          url: "/",
          icon: <TimerIcon />
        },
        {
          id: "Users",
          url: "/users",
          icon: <PeopleIcon />
        },
        {
          id: "Teams",
          url: "/teams",
          icon: <PeopleIcon />
        }
      ]
    };

    if (isAuthenticated) {
      links.unshift(authorizedLinks);
      if (adminUsers && adminUsers.includes(user.alias)) {
        links.push(adminLinks);
      }
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
              {children.map(({ id: childId, url, icon, onClick }) => (
                <ListItem
                  key={childId}
                  button
                  className={clsx(
                    classes.item,
                    this.isHeaderActive(childId.toLowerCase()) &&
                      classes.itemActiveItem
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
  logout: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  auth: PropTypes.object,
  history: PropTypes.object,
  header: PropTypes.object,
  getConfigs: PropTypes.func,
  configs: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  header: state.header,
  configs: state.configs
});

export default connect(
  mapStateToProps,
  { getConfigs, logout }
)(withStyles(styles)(Navigator));
