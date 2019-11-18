import React, { Component } from "react";
import PropTypes from "prop-types";
import starwarsNames from "starwars-names";
import MuiDownshift from "mui-downshift";

import { withStyles } from "@material-ui/core/styles";
import { listStyles } from "../layout/styles";

const items = starwarsNames.all.map((label, value) => ({ label, value }));

class UsersCombo extends Component {
  static defaultProps = {
    blurOnSelect: false
  };
  state = {
    filteredItems: items
  };
  handleStateChange = changes => {
    if (typeof changes.inputValue === "string") {
      const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(changes.inputValue.toLowerCase())
      );
      this.setState({ filteredItems });
    }
    if (this.input && this.props.blurOnSelect) {
      this.input.blur();
    }
  };
  render() {
    const { filteredItems } = this.state;
    return (
      <MuiDownshift
        items={filteredItems}
        onStateChange={this.handleStateChange}
        {...this.props}
        inputRef={node => {
          this.input = node;
        }}
      />
    );
  }
}

UsersCombo.propTypes = {
  blurOnSelect: PropTypes.bool
};

export default withStyles(listStyles)(UsersCombo);
