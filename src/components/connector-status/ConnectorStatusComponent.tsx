import { Text, View } from "native-base";
import React from "react";
import { Animated, Easing, Platform } from "react-native";
import BaseProps from "../../types/BaseProps";
import Connector from "../../types/Connector";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";
import computeStyleSheet from "./ConnectorStatusComponentStyles";

export interface Props extends BaseProps {
  connector?: Connector;
  text: string;
  value?: number;
  type?: string;
}

interface State {
}

export default class ConnectorStatusComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private rotateClockwise: Animated.AnimatedInterpolation;
  private rotateCounterClockwise: Animated.AnimatedInterpolation;

  constructor(props: Props) {
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

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getConnectorStyles(style: any) {
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

  public getConnectorValue(): string {
    // Get value
    const { value, connector } = this.props;
    if (connector) {
      return Utils.getConnectorLetter(connector.connectorId);
    } else {
      return '' + value;
    }
  }

  public isAnimated(): boolean {
    const { value, type, connector } = this.props;
    if (connector) {
      return connector.currentConsumption > 0;
    } else {
      return type === Constants.CONN_STATUS_CHARGING && value > 0;
    }
  }

  public render() {
    const style = computeStyleSheet();
    // Get styling
    const connectorStyles = this.getConnectorStyles(style);
    // Get value
    const value = this.getConnectorValue();
    // Animated
    const isAnimated = this.isAnimated();
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
