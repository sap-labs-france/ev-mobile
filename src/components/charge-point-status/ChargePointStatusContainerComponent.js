import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ChargePointStatusContainerStyles.js";
import { Badge, Text, View } from "native-base";
import I18n from "../../I18n/I18n";
import ChargePointStatusComponent from "./ChargePointStatusComponent";

const style = computeStyleSheet();

export default class ChargePoinStatusContainerComponent extends ResponsiveComponent {
  render() {
    return (
      <View style={style.container}>
        <Text style={style.connectorText}>{I18n.t("sites.chargePoint")}</Text>
        <ChargePointStatusComponent
          value={this.props.availableConnectors}
          text={I18n.t("sites.free")}
        />
        <ChargePointStatusComponent
          value={this.props.totalConnectors - this.props.availableConnectors}
          text={I18n.t("sites.occupied")}
          type="occupied"
        />
      </View>
    );
  }
}

ChargePoinStatusContainerComponent.propTypes = {
  totalConnectors: PropTypes.number.isRequired,
  availableConnectors: PropTypes.number.isRequired
};
