import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

class TextFieldGroup extends Component {
  render() {
    const {
      id,
      label,
      name,
      type,
      variant,
      value,
      autoComplete,
      onChange,
      error,
      info
    } = this.props;
    return (
      <div>
        <TextField
          error={!!error}
          variant={variant}
          type={type}
          required
          fullWidth
          id={id}
          label={label}
          name={name}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
        />
        {info && <div>{info}</div>}
        {error && <div>{error}</div>}
      </div>
    );
  }
}

TextFieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

TextFieldGroup.defaultProps = {
  variant: "outlined",
  type: "text"
};

export default TextFieldGroup;
