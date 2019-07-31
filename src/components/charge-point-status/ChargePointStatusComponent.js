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

  render() {
    const style = computeStyleSheet();
    const isCharging = this.props.type === Constants.CONN_STATUS_CHARGING;
    const connectorStyle = [];
    const connectorTextStyle = [style.connectorValue];
    switch (this.props.type) {
      // Charging
      case Constants.CONN_STATUS_CHARGING:
        connectorStyle.push(style.chargingConnector);
        connectorTextStyle.push(style.chargingConnectorValue);
        break;
      // Suspending
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
        connectorStyle.push(style.supendedConnector);
        connectorTextStyle.push(style.supendedConnectorValue);
        break;
      // Available
      case Constants.CONN_STATUS_AVAILABLE:
        connectorStyle.push(style.freeConnector);
        connectorTextStyle.push(style.freeConnectorValue);
        break;
    }

    return (
      <View style={style.container}>
        <Animated.View style={[{ transform: [{ rotate: this.spin }] }]}>
          <Badge style={[...connectorStyle]}>
          </Badge>
        </Animated.View>
        <Text style={connectorTextStyle}>{ this.props.value }</Text>
        {this.props.text ?
          <Text style={style.connectorSubTitle}>{this.props.text}</Text>
        :
          undefined
        }
      </View>
    );
  }
}

ChargePointStatusComponent.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
  type: PropTypes.string.isRequired
};
