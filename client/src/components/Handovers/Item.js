import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "../../utils/is-empty";

import SelectFieldGroup from "../common/SelectFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import Grid from "@material-ui/core/Grid";

import { getConfigs } from "../../redux/actions/configActions";

class Item extends Component {
  state = {
    status: "",
    link: ""
  };

  componentDidMount() {
    this.props.getConfigs();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
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
            value={this.state.link}
            autoComplete="link"
            helperText="URL to the problem in ticketing portal"
            onChange={this.onChange}
          />
        </Grid>

        <Grid item xs={6}>
          <SelectFieldGroup
            id="status"
            label="Status"
            name="status"
            value={this.state.status}
            options={validStatuses}
            helperText="how much progress was on the handover item?"
            onChange={this.onChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFieldGroup
            id="description"
            label="Description"
            name="description"
            value={this.state.description}
            autoComplete="description"
            helperText="Any explanation to clarify the situation"
            onChange={this.onChange}
          />
        </Grid>
      </Grid>
    );
  }
}

Item.propTypes = {
  getConfigs: PropTypes.func.isRequired,
  configs: PropTypes.object
};

const mapStateToProps = state => ({
  configs: state.configs
});

export default connect(
  mapStateToProps,
  { getConfigs }
)(Item);
