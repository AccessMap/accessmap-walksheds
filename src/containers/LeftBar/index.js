import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Box, FormField, Heading, RadioButtonGroup, RangeInput } from "grommet";

import * as AppActions from "../../actions";


class ControlBar extends Component {
  render() {
    const {
      actions,
      travelMode,
      walktime
    } = this.props;

    return (
      <Box direction="column">
        <Heading>AccessMap Walksheds</Heading>
        <Box direction="column" margin={{ bottom: "medium" }}>
          <FormField label={`Minutes of travel: ${walktime / 60}`} pad>
            <RangeInput
              min={1}
              max={10}
              step={1}
              name="Select minutes of travel"
              value={walktime / 60}
              label="Minutes of travel"
              onChange={(e) => {
                // TODO: this is a messed-up way to handle state (global variable). Use
                // component state?
                const target = e.target || null;
                if (target === null) return;
                actions.setWalktime(target.value * 60);
              }}
            />
          </FormField>
        </Box>
        <Box direction="column">
          <FormField label="Select travel mode" pad>
            <RadioButtonGroup
              name="Select Travel Mode"
              options={["Manual wheelchair", "Powered wheelchair", "Cane", "Walk"]}
              value={travelMode}
              onChange={(e) => {
                const target = e.target || null;
                if (target === null) return;
                actions.setTravelMode(target.value);
              }}
            />
          </FormField>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  travelMode: state.travelMode,
  walktime: state.walktime,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(AppActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlBar);
