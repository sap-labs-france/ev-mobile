import I18n from 'i18n-js';
import { Text, View } from 'native-base';
import React from 'react';
import { Animated, Easing, Platform } from 'react-native';

import BaseProps from '../../types/BaseProps';
import { ChargePointStatus, Connector } from '../../types/ChargingStation';
import Utils from '../../utils/Utils';
import computeStyleSheet from './ConnectorStatusComponentStyles';

export interface Props extends BaseProps {
  connector?: Connector;
  text?: string;
  value?: number;
  status?: string;
  inactive?: boolean;
}

interface State {}

export default class ConnectorStatusComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private rotateClockwise: Animated.AnimatedInterpolation;
  private rotateCounterClockwise: Animated.AnimatedInterpolation;

  public constructor(props: Props) {
    super(props);
    this.state = {};
    // Create
    const spinValue = new Animated.Value(0);
    // First set up animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
    // Second interpolate beginning and end values (in this case 0 and 1)
    this.rotateClockwise = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    this.rotateCounterClockwise = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg']
    });
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public getConnectorStyles(style: any): {
    container: Record<string, unknown>[];
    value: Record<string, unknown>[];
    description: Record<string, unknown>[];
  } {
    const { status, connector, inactive } = this.props;
    // Get the type
    let connectorType;
    let styleStatusName;
    // Status Provided: Force status
    if (connector) {
      connectorType = connector.status;
    }
    // Status Provided: Force status
    if (status) {
      connectorType = status;
    }
    // Inactive Charging Station
    if (inactive) {
      connectorType = ChargePointStatus.UNAVAILABLE;
    }
    // Default CSS
    const connectorStyles = {
      container: [style.commonConnector],
      value: [style.commonConnectorValue],
      description: [style.commonConnectorDescription]
    };
    switch (connectorType) {
      // Charging
      case ChargePointStatus.CHARGING:
      case ChargePointStatus.OCCUPIED:
        styleStatusName = 'charging';
        break;
      // Preparing
      case ChargePointStatus.PREPARING:
        styleStatusName = 'preparing';
        break;
      // Preparing
      case ChargePointStatus.FINISHING:
        styleStatusName = 'finishing';
        break;
      // Reserved
      case ChargePointStatus.RESERVED:
        styleStatusName = 'reserved';
        break;
      // Faulted
      case ChargePointStatus.FAULTED:
        styleStatusName = 'faulted';
        break;
      // Unavailable
      case ChargePointStatus.UNAVAILABLE:
        styleStatusName = 'unavailable';
        break;
      // Suspending EV / EVSE
      case ChargePointStatus.SUSPENDED_EVSE:
      case ChargePointStatus.SUSPENDED_EV:
        styleStatusName = 'suspended';
        break;
      // Available
      case ChargePointStatus.AVAILABLE:
        styleStatusName = 'available';
        break;
      // Default
      default:
        styleStatusName = 'unavailable';
        break;
    }
    if (styleStatusName) {
      connectorStyles.container.push(style[styleStatusName + 'Connector']);
      connectorStyles.value.push(style[styleStatusName + 'ConnectorValue']);
      connectorStyles.description.push(style[styleStatusName + 'ConnectorDescription']);
    }
    return connectorStyles;
  }

  public getConnectorValue(): string {
    // Get value
    const { value, connector } = this.props;
    if (connector) {
      return Utils.getConnectorLetterFromConnectorID(connector.connectorId);
    } else if (value >= 0) {
      return String(value);
    } else {
      return '-';
    }
  }

  public getConnectorText(): string {
    const { text, status, inactive, connector } = this.props;
    // Inactive charging station
    if (inactive) {
      return Utils.translateConnectorStatus(ChargePointStatus.UNAVAILABLE);
    }
    // Text provided: Force text label
    if (text) {
      return I18n.t(text);
    }
    // Status provided: Force status label
    if (status) {
      return Utils.translateConnectorStatus(status);
    }
    // No connector
    if (!connector) {
      return Utils.translateConnectorStatus(ChargePointStatus.UNAVAILABLE);
    }
    // Connector's status text
    return Utils.translateConnectorStatus(connector.status);
  }

  public isAnimated(): boolean {
    const { value, status, connector } = this.props;
    if (connector) {
      return connector.currentInstantWatts > 0;
    } else {
      return status === ChargePointStatus.CHARGING && value > 0;
    }
  }

  public render() {
    const style = computeStyleSheet();
    // Get styling
    const connectorStyles = this.getConnectorStyles(style);
    // Get text
    const connectorText = this.getConnectorText();
    // Get value
    const value = this.getConnectorValue();
    // Animated
    const isAnimated = this.isAnimated();
    const isAndroid = Platform.OS === 'android';
    return (
      <View style={connectorText ? style.containerWithDescription : style.containerWithNoDescription}>
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
        {connectorText && <Text style={connectorStyles.description}>{connectorText}</Text>}
      </View>
    );
  }
}
