import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ConnectorStatusComponentStyles.js";
import { Animated, Easing, Platform } from "react-native";
import { Text, View } from "native-base";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";

export default class ConnectorStatusComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // Create
    const spinValue = new Animated.Value(0);
    // First set up animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      })
    ).start();
    // Second interpolate beginning and end values (in this case 0 and 1)
    this.rotateClockwise = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    this.rotateCounterClockwise = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["360deg", "0deg"]
    });
  }

  _getConnectorStyles(style) {
    const { type, connector } = this.props;
    // Get the type
    let connectorType;
    let status;
    if (connector) {
      connectorType = connector.status;
    } else {
      connectorType = type;
    }
    // Default CSS
    const connectorStyles = {
      container: [style.commonConnector],
      value: [style.commonConnectorValue],
      description: [style.commonConnectorDescription]
    };
    switch (connectorType) {
      // Charging
      case Constants.CONN_STATUS_CHARGING:
      case Constants.CONN_STATUS_OCCUPIED:
        status = "charging";
        break;
      // Preparing
      case Constants.CONN_STATUS_PREPARING:
        status = "preparing";
        break;
      // Preparing
      case Constants.CONN_STATUS_FINISHING:
        status = "finishing";
        break;
      // Reserved
      case Constants.CONN_STATUS_RESERVED:
        status = "reserved";
        break;
      // Faulted
      case Constants.CONN_STATUS_FAULTED:
        status = "faulted";
        break;
      // Unavailable
      case Constants.CONN_STATUS_UNAVAILABLE:
        status = "unavailable";
        break;
      // Suspending EV / EVSE
      case Constants.CONN_STATUS_SUSPENDED:
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
      case Constants.CONN_STATUS_SUSPENDED_EV:
        status = "suspended";
        break;
      // Available
      case Constants.CONN_STATUS_AVAILABLE:
        status = "available";
        break;
    }
    if (status) {
      connectorStyles.container.push(style[status + "Connector"]);
      connectorStyles.value.push(style[status + "ConnectorValue"]);
      connectorStyles.description.push(style[status + "ConnectorDescription"]);
    }
    return connectorStyles;
  }

  _getConnectorValue() {
    // Get value
    const { value, connector } = this.props;
    if (connector) {
      return Utils.getConnectorLetter(connector.connectorId);
    } else {
      return value;
    }
  }

  _isAnimated() {
    const { value, type, connector } = this.props;
    if (connector) {
      return connector.currentConsumption > 0;
    } else {
      return type === Constants.CONN_STATUS_CHARGING && value > 0;
    }
  }

  render() {
    const style = computeStyleSheet();
    // Get styling
    const connectorStyles = this._getConnectorStyles(style);
    // Get value
    const value = this._getConnectorValue();
    // Animated
    const isAnimated = this._isAnimated();
    const isAndroid = Platform.OS === "android";
    return (
      <View style={this.props.text ? style.containerWithDescription : style.containerWithNoDescription}>
        {isAndroid ? (
          <View>
            <View style={connectorStyles.container}>
              <Text style={connectorStyles.value}>{value}</Text>
            </View>
          </View>
        ) : (
          <Animated.View style={isAnimated ? { transform: [{ rotate: this.rotateClockwise }] } : undefined}>
            <View style={connectorStyles.container}>
              <Animated.Text
                style={
                  isAnimated ? [...connectorStyles.value, { transform: [{ rotate: this.rotateCounterClockwise }] }] : connectorStyles.value
                }>
                {value}
              </Animated.Text>
            </View>
          </Animated.View>
        )}
        {this.props.text && <Text style={connectorStyles.description}>{this.props.text}</Text>}
      </View>
    );
  }
}

ConnectorStatusComponent.propTypes = {
  connector: PropTypes.object,
  value: PropTypes.number,
  text: PropTypes.string,
  type: PropTypes.string
};
