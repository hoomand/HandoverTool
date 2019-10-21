import React, { Component } from "react";
import PropTypes from "prop-types";
import { selectStyles } from "../layout/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/styles";

class SelectFieldGroup extends Component {
  render() {
    const {
      id,
      label,
      name,
      value,
      options,
      helperText,
      onChange,
      error,
      info
    } = this.props;

    const { classes } = this.props;
    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select value={value} onChange={onChange} name={name} id={id}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {options.map(option => (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
        {info && <div>{info}</div>}
        {error && <div>{error}</div>}
      </div>
    );
  }
}

SelectFieldGroup.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  helperText: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default withStyles(selectStyles)(SelectFieldGroup);
