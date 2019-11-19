import React, { Component } from "react";
import PropTypes from "prop-types";
import MuiDownshift from "mui-downshift";

import { connect } from "react-redux";
import { getUsers } from "../../redux/actions/userActions";

import { withStyles } from "@material-ui/core/styles";
import { listStyles } from "../layout/styles";

class UsersCombo extends Component {
  static defaultProps = {
    blurOnSelect: false
  };
  state = {
    filteredItems: [],
    users: [],
    selectedUser: ""
  };

  componentDidMount() {
    this.props.getUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props.users !== prevProps.users) {
      const allUsers = this.props.users.data.map(user => ({
        label: user.alias,
        value: user.alias
      }));

      this.setState({
        users: allUsers,
        filteredItems: allUsers
      });
    }
  }

  handleStateChange = changes => {
    if (typeof changes.inputValue === "string") {
      const filteredItems = this.state.users.filter(item =>
        item.label.toLowerCase().includes(changes.inputValue.toLowerCase())
      );
      this.setState({ filteredItems });
    }
    if (this.input && this.props.blurOnSelect) {
      this.input.blur();
    }
  };

  onChange = selectedUser => {
    this.setState({ selectedUser: selectedUser.value });
    const { onUserChange } = this.props;
    if (onUserChange) {
      onUserChange(selectedUser.value);
    }
  };

  render() {
    const { filteredItems } = this.state;
    return (
      <MuiDownshift
        helperText="joosh"
        items={filteredItems}
        loading={this.props.users.length === 0}
        onStateChange={this.handleStateChange}
        onChange={this.onChange}
        {...this.props}
        inputRef={node => {
          this.input = node;
        }}
      />
    );
  }
}

UsersCombo.propTypes = {
  blurOnSelect: PropTypes.bool,
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  onUserChange: PropTypes.func
};

const mapStateToProps = state => ({
  users: state.users
});

export default connect(
  mapStateToProps,
  { getUsers }
)(withStyles(listStyles)(UsersCombo));
