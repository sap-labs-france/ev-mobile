import React, { Component } from "react";
import { Text as TextRN } from "react-native";
import { View } from "native-base";
import Constants from "../../utils/Constants";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

class ConnectorStatusComponent extends Component {
  _getStyleFromStatus(item) {
    switch (item.status) {
      // Green
      case Constants.CONN_STATUS_AVAILABLE:
        return styles.statusGreen;
      // Red
      case Constants.CONN_STATUS_SUSPENDED_EV:
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
      case Constants.CONN_STATUS_OCCUPIED:
      case Constants.CONN_STATUS_CHARGING:
      case Constants.CONN_STATUS_FAULTED:
      case Constants.CONN_STATUS_RESERVED:
      case Constants.CONN_STATUS_UNAVAILABLE:
        return styles.statusRed;
      // Orange
      case Constants.CONN_STATUS_PREPARING:
      case Constants.CONN_STATUS_FINISHING:
        return styles.statusOrange;
    }
  }

  _getStatusAnimation(item) {
    // First check
    if (item.currentConsumption > 0) {
      return "fadeIn";
    }
    return "";
  }

  render() {
    const { item } = this.props;
    const connectorLetter = String.fromCharCode(64 + item.connectorId);
    return (
      <View style={styles.connectorStatus}>
        <Animatable.View animation={this._getStatusAnimation(item)} iterationCount={"infinite"} direction="alternate-reverse">
          <View style={this._getStyleFromStatus(item)}>
            <TextRN style={styles.statusLetter}>{connectorLetter}</TextRN>
          </View>
        </Animatable.View>
      </View>
    );
  }
}

export default ConnectorStatusComponent;
