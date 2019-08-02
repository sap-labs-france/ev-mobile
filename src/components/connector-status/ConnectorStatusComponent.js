import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ConnectorStatusComponentStyles.js";
import { Animated, Easing } from "react-native";
import { Badge, Text, View } from "native-base";
import Constants from "../../utils/Constants";

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
    if (connector) {
      connectorType = connector.status;
    } else {
      connectorType = type;
    }
    // Default CSS
    const connectorStyles = {
      badge: [style.commonConnector],
      text: []
    };
    switch (connectorType) {
      // Charging
      case Constants.CONN_STATUS_CHARGING:
      case Constants.CONN_STATUS_OCCUPIED:
        connectorStyles.badge.push(style.chargingConnector);
        connectorStyles.text.push(style.chargingConnectorText);
        break;
      // Preparing
      case Constants.CONN_STATUS_PREPARING:
        connectorStyles.badge.push(style.preparingConnector);
        connectorStyles.text.push(style.preparingConnectorText);
        break;
      // Preparing
      case Constants.CONN_STATUS_FINISHING:
        connectorStyles.badge.push(style.finishingConnector);
        connectorStyles.text.push(style.finishingConnectorText);
        break;
      // Reserved
      case Constants.CONN_STATUS_RESERVED:
        connectorStyles.badge.push(style.reservedConnector);
        connectorStyles.text.push(style.reservedConnectorText);
        break;
      // Faulted
      case Constants.CONN_STATUS_FAULTED:
        connectorStyles.badge.push(style.faultedConnector);
        connectorStyles.text.push(style.faultedConnectorText);
        break;
      // Unavailable
      case Constants.CONN_STATUS_UNAVAILABLE:
        connectorStyles.badge.push(style.unavailableConnector);
        connectorStyles.text.push(style.unavailableConnectorText);
        break;
      // Suspending EV / EVSE
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
      case Constants.CONN_STATUS_SUSPENDED_EV:
        connectorStyles.badge.push(style.supendedConnector);
        connectorStyles.text.push(style.supendedConnectorText);
        break;
      // Available
      case Constants.CONN_STATUS_AVAILABLE:
        connectorStyles.badge.push(style.availableConnector);
        connectorStyles.text.push(style.availableConnectorText);
        break;
    }
    return connectorStyles;
  }

  _getConnectorValue() {
    // Get value
    const { value, connector } = this.props;
    if (connector) {
      return String.fromCharCode(64 + connector.connectorId);
    } else {
      return value;
    }
  }

  _isAnimated() {
    const { value, type, connector } = this.props;
    if (connector) {
      return connector.currentConsumption > 0;
    } else {
      return (type === Constants.CONN_STATUS_CHARGING) && (value > 0);
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
    return (
      <View style={this.props.text ? style.containerWithText : style.containerWithNoText}>
        <Animated.View style={isAnimated ? { transform: [{ rotate: this.rotateClockwise }] } : undefined}>
          <Badge style={connectorStyles.badge}>
            <Animated.Text style={
              isAnimated ?
                [ style.connectorValue, ...connectorStyles.badge, { transform: [{ rotate: this.rotateCounterClockwise }] }]
              :
                [ style.connectorValue, ...connectorStyles.badge ]
              }>{ value }</Animated.Text>
          </Badge>
        </Animated.View>
        {this.props.text ?
          <Text style={[...connectorStyles.text, style.connectorDescription]}>{this.props.text}</Text>
        :
          undefined
        }
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
