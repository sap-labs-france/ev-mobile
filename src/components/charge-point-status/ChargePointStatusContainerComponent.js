import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ChargePointStatusContainerComponentStyles.js";
import { Text, View } from "native-base";
import I18n from "../../I18n/I18n";
import ChargePointStatusComponent from "./ChargePointStatusComponent";
import Constants from "../../utils/Constants";

const style = computeStyleSheet();

export default class ChargePoinStatusContainerComponent extends ResponsiveComponent {
  render() {
    return (
      <View style={style.container}>
        <ChargePointStatusComponent
          value={this.props.availableConnectors}
          text={I18n.t("chargers.status_available")}
          type={Constants.CONN_STATUS_AVAILABLE}
        />
        {/* <ChargePointStatusComponent
          value={this.props.totalConnectors - this.props.availableConnectors}
          text={I18n.t("chargers.status_suspended")}
          type={Constants.CONN_STATUS_SUSPENDED_EVSE}
        /> */}
        <ChargePointStatusComponent
          value={this.props.totalConnectors - this.props.availableConnectors}
          text={I18n.t("chargers.status_charging")}
          type={Constants.CONN_STATUS_CHARGING}
        />
      </View>
    );
  }
}

ChargePoinStatusContainerComponent.propTypes = {
  totalConnectors: PropTypes.number.isRequired,
  availableConnectors: PropTypes.number.isRequired
};
