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
      helperText,
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
          helperText={helperText}
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
  helperText: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.string,
  type: PropTypes.string,
  autoComplete: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
