import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ChargePointStatusComponentStyles.js";
import { Animated, Easing } from "react-native";
import { Badge, Text, View } from "native-base";
import Constants from "../../utils/Constants";


export default class ChargePointStatusComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // Start animation
    this._buildAnimation();
  }

  _buildAnimation() {
    // Create
    this.spinValue = new Animated.Value(0);
    // First set up animation
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear
      })
    ).start();
    // Second interpolate beginning and end values (in this case 0 and 1)
    this.spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
  }

  _getConnectorStyle(style) {
    const { type, connector } = this.props;
    let connectorType;
    if (connector) {
      connectorType = connector.status;
    } else {
      connectorType = type;
    }
    switch (connectorType) {
      // Charging
      case Constants.CONN_STATUS_CHARGING:
      case Constants.CONN_STATUS_OCCUPIED:
        return style.chargingConnector;
      // Preparing
      case Constants.CONN_STATUS_PREPARING:
        return style.preparingConnector;
      // Preparing
      case Constants.CONN_STATUS_FINISHING:
        return style.finishingConnector;
      // Reserved
      case Constants.CONN_STATUS_RESERVED:
        return style.reservedConnector;
      // Faulted
      case Constants.CONN_STATUS_FAULTED:
        return style.faultedConnector;
      // Unavailable
      case Constants.CONN_STATUS_UNAVAILABLE:
        return style.unavailableConnector;
      // Suspending EV / EVSE
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
      case Constants.CONN_STATUS_SUSPENDED_EV:
        return style.supendedConnector;
      // Available
      case Constants.CONN_STATUS_AVAILABLE:
        return style.availableConnector;
    }
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
    const { value, connector } = this.props;
    if (connector) {
      return connector.currentConsumption > 0;
    } else {
      return value > 0;
    }
    console.log(connector);
    console.log(typeof value);
  }

  render() {
    const style = computeStyleSheet();
    // Get styling
    const connectorStyle = this._getConnectorStyle(style);
    // Get value
    const value = this._getConnectorValue();
    // Animated
    const isAnimated = this._isAnimated();

    return (
      <View style={this.props.text ? style.containerWithText : style.containerWithNoText}>
        <Animated.View style={isAnimated ? { transform: [{ rotate: this.spin }] } : undefined }>
          <Badge style={connectorStyle}>
          </Badge>
        </Animated.View>
        <Text style={style.connectorValue}>{ value }</Text>
        {this.props.text ?
          <Text style={style.connectorText}>{this.props.text}</Text>
        :
          undefined
        }
      </View>
    );
  }
}

ChargePointStatusComponent.propTypes = {
  connector: PropTypes.object,
  value: PropTypes.number,
  text: PropTypes.string,
  type: PropTypes.string
};
