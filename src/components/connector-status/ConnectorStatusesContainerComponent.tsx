import { View } from "native-base";
import PropTypes from "prop-types";
import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";
import ConnectorStatusComponent from "./ConnectorStatusComponent";
import computeStyleSheet from "./ConnectorStatusesContainerComponentStyles";

import I18n from "../../I18n/I18n";
const style = computeStyleSheet();

export default class ConnectorStatusesContainerComponent extends ResponsiveComponent {
  render() {
    const { connectorStats } = this.props;
    return (
      <View style={style.container}>
        <ConnectorStatusComponent
          value={connectorStats.availableConnectors}
          text={Utils.translateConnectorStatus(Constants.CONN_STATUS_AVAILABLE)}
          type={Constants.CONN_STATUS_AVAILABLE}
        />
        <ConnectorStatusComponent
          value={
            connectorStats.suspendedConnectors +
            connectorStats.finishingConnectors +
            connectorStats.preparingConnectors +
            connectorStats.unavailableConnectors
          }
          text={I18n.t("connector.notCharging")}
          type={Constants.CONN_STATUS_SUSPENDED}
        />
        <ConnectorStatusComponent
          value={connectorStats.chargingConnectors}
          text={Utils.translateConnectorStatus(Constants.CONN_STATUS_CHARGING)}
          type={Constants.CONN_STATUS_CHARGING}
        />
      </View>
    );
  }
}

ConnectorStatusesContainerComponent.propTypes = {
  connectorStats: PropTypes.object.isRequired
};
