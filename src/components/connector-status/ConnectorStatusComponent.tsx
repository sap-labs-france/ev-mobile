import { Text, View } from 'native-base';
import React from 'react';
import { Animated, Easing, Platform } from 'react-native';

import BaseProps from '../../types/BaseProps';
import { ChargePointStatus, Connector } from '../../types/ChargingStation';
import Utils from '../../utils/Utils';
import computeStyleSheet from './ConnectorStatusComponentStyles';

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
      outputRange: ['0deg', '360deg']
    });

    this.rotateCounterClockwise = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg']
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
    } else if (type) {
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
      case ChargePointStatus.CHARGING:
      case ChargePointStatus.OCCUPIED:
        status = 'charging';
        break;
      // Preparing
      case ChargePointStatus.PREPARING:
        status = 'preparing';
        break;
      // Preparing
      case ChargePointStatus.FINISHING:
        status = 'finishing';
        break;
      // Reserved
      case ChargePointStatus.RESERVED:
        status = 'reserved';
        break;
      // Faulted
      case ChargePointStatus.FAULTED:
        status = 'faulted';
        break;
      // Unavailable
      case ChargePointStatus.UNAVAILABLE:
        status = 'unavailable';
        break;
      // Suspending EV / EVSE
      case ChargePointStatus.SUSPENDED_EVSE:
      case ChargePointStatus.SUSPENDED_EV:
        status = 'suspended';
        break;
      // Available
      case ChargePointStatus.AVAILABLE:
        status = 'available';
        break;
      // Default
      default:
        case ChargePointStatus.UNAVAILABLE:
          status = 'unavailable';
          break;
      }
    if (status) {
      connectorStyles.container.push(style[status + 'Connector']);
      connectorStyles.value.push(style[status + 'ConnectorValue']);
      connectorStyles.description.push(style[status + 'ConnectorDescription']);
    }
    return connectorStyles;
  }

  public getConnectorValue(): string {
    // Get value
    const { value, connector } = this.props;
    if (connector) {
      return Utils.getConnectorLetterFromConnectorID(connector.connectorId);
    } else if (value >= 0) {
      return '' + value;
    } else {
      return '-';
    }
  }

  public isAnimated(): boolean {
    const { value, type, connector } = this.props;
    if (connector) {
      return connector.currentInstantWatts > 0;
    } else {
      return type === ChargePointStatus.CHARGING && value > 0;
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
    const isAndroid = Platform.OS === 'android';
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
