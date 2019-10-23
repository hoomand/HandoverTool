import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "../../utils/is-empty";

import SelectFieldGroup from "../common/SelectFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import Grid from "@material-ui/core/Grid";

import { getConfigs } from "../../redux/actions/configActions";

class Item extends Component {
  componentDidMount() {
    this.props.getConfigs();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { status, link, description } = this.props.value;
    const { handoverItem } = this.props.configs.data;
    const validStatuses = !isEmpty(handoverItem)
      ? handoverItem.validStatuses
      : {};

    return (
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <TextFieldGroup
            id="link"
            label="Link"
            name="link"
            value={link}
            autoComplete="link"
            helperText="URL to the problem in ticketing portal"
            onChange={e => this.props.onChange(e)}
          />
        </Grid>

        <Grid item xs={6}>
          <SelectFieldGroup
            id="status"
            label="Status"
            name="status"
            value={status}
            options={validStatuses}
            helperText="how much progress was on the handover item?"
            onChange={e => this.props.onChange(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFieldGroup
            id="description"
            label="Description"
            name="description"
            value={description}
            autoComplete="description"
            helperText="Any explanation to clarify the situation"
            onChange={e => this.props.onChange(e)}
          />
        </Grid>
      </Grid>
    );
  }
}

Item.propTypes = {
  getConfigs: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  configs: PropTypes.object,
  value: PropTypes.object
};

const mapStateToProps = state => ({
  configs: state.configs
});

export default connect(
  mapStateToProps,
  { getConfigs }
)(Item);
