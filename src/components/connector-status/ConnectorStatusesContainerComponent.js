import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ConnectorStatusesContainerComponentStyles.js";
import { View } from "native-base";
import I18n from "../../I18n/I18n";
import ConnectorStatusComponent from "./ConnectorStatusComponent";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";

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
          value={connectorStats.suspendedConnectors + connectorStats.finishingConnectors + connectorStats.preparingConnectors}
          text={I18n.t("connector.notCharging")}
          type={Constants.CONN_STATUS_SUSPENDED}
        />
        <ConnectorStatusComponent
          value={connectorStats.chargingConnectors}
          text={Utils.translateConnectorStatus(Constants.CONN_STATUS_CHARGING)}
          type={Constants.CONN_STATUS_CHARGING}
        />
        {
          connectorStats.unavailableConnectors ?
            <ConnectorStatusComponent
              value={connectorStats.unavailableConnectors}
              text={Utils.translateConnectorStatus(Constants.CONN_STATUS_UNAVAILABLE)}
              type={Constants.CONN_STATUS_UNAVAILABLE}
            />
          :
            undefined
        }
      </View>
    );
  }
}

ConnectorStatusesContainerComponent.propTypes = {
  connectorStats: PropTypes.object.isRequired
};
