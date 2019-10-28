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
      required
    } = this.props;
    return (
      <div>
        <TextField
          error={!!error}
          variant={variant}
          type={type}
          required={required}
          fullWidth
          id={id}
          label={label}
          name={name}
          value={value}
          autoComplete={autoComplete}
          helperText={error ? error : helperText}
          onChange={onChange}
        />
      </div>
    );
  }
}

TextFieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.string,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  required: PropTypes.bool
};

TextFieldGroup.defaultProps = {
  type: "text",
  required: true
};

export default TextFieldGroup;
