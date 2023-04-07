import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { Connector } from '../../../types/ChargingStation';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import ConnectorStatusComponent from '../../connector-status/ConnectorStatusComponent';
import computeStyleSheet from './ChargingStationConnectorComponentStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {
  chargingStation: ChargingStation;
  connector: Connector;
  onNavigate?: () => void;
  listed?: boolean;
}

interface State {
  showBatteryLevel?: boolean;
}

export default class ChargingStationConnectorComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private timerAnimation: NodeJS.Timeout;

  public constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      showBatteryLevel: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public componentDidMount() {
    // Refresh every minutes
    this.timerAnimation = setInterval(() => {
      // Animate
      this.animate();
    }, Constants.ANIMATION_PERIOD_MILLIS);
  }

  public componentWillUnmount() {
    // Stop the timer
    if (this.timerAnimation) {
      clearInterval(this.timerAnimation);
    }
  }

  public animate() {
    const { connector } = this.props;
    if (connector && connector.currentStateOfCharge === 0) {
      // SoC not supported
      return;
    }
    // Switch battery/Consumption
    this.setState({
      showBatteryLevel: !this.state.showBatteryLevel
    });
  }

  public renderFirstConnectorDetails = (chargingStation: ChargingStation, connector: Connector) => (
    <ConnectorStatusComponent navigation={this.props.navigation} connector={connector} inactive={chargingStation.inactive} />
  );

  public renderSecondConnectorDetails = (chargingStation: ChargingStation, connector: Connector, style: any) =>
    connector.currentTransactionID !== 0 && !chargingStation.inactive ? (
      <View style={style.connectorDetail}>
        <Animatable.View
          animation={!this.state.showBatteryLevel ? 'fadeIn' : 'fadeOut'}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>
            {connector.currentInstantWatts / 1000 < 10
              ? connector.currentInstantWatts > 0
                ? I18nManager.formatNumber(Math.round(connector.currentInstantWatts / 10) / 100)
                : 0
              : I18nManager.formatNumber(Math.trunc(connector.currentInstantWatts / 1000))}
          </Text>
          <Text style={style.label} numberOfLines={1}>
            {I18n.t('details.instant')}
          </Text>
          <Text style={style.subLabel} numberOfLines={1}>
            (kW)
          </Text>
        </Animatable.View>
        <Animatable.View
          animation={this.state.showBatteryLevel ? 'fadeIn' : 'fadeOut'}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>{connector.currentStateOfCharge}</Text>
          <Text style={style.label} numberOfLines={1}>
            {I18n.t('details.battery')}
          </Text>
          <Text style={style.subLabel} numberOfLines={1}>
            (%)
          </Text>
        </Animatable.View>
      </View>
    ) : (
      <View style={style.connectorDetail}>
        {Utils.buildConnectorTypeSVG(connector?.type)}
        <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
      </View>
    );

  public renderThirdConnectorDetails = (chargingStation: ChargingStation, connector: Connector, style: any) =>
    connector.currentTransactionID !== 0 && !chargingStation.inactive ? (
      <View style={style.connectorDetail}>
        <Text style={style.connectorValues}>{I18nManager.formatNumber(Math.round(connector.currentTotalConsumptionWh / 1000))}</Text>
        <Text style={style.label} numberOfLines={1}>
          {I18n.t('details.total')}
        </Text>
        <Text style={style.subLabel} numberOfLines={1}>
          (kW.h)
        </Text>
      </View>
    ) : (
      <View style={style.connectorDetail}>
        <Text style={style.connectorValues}>{I18nManager.formatNumber(Math.trunc(connector.power / 1000))}</Text>
        <Text style={style.label} numberOfLines={1}>
          {I18n.t('details.maximum')}
        </Text>
        <Text style={style.subLabel} numberOfLines={1}>
          (kW)
        </Text>
      </View>
    );

  public render() {
    const style = computeStyleSheet();
    const { connector, navigation, chargingStation, onNavigate, listed } = this.props;
    return (
      <TouchableOpacity
        style={[style.container, listed && style.borderedBottomContainer]}
        disabled={chargingStation.inactive || !listed}
        onPress={() => {
          if (onNavigate) {
            onNavigate();
          }
          navigation.navigate('ChargingStationConnectorDetailsTabs', {
            params: {
              params: {
                chargingStationID: chargingStation.id,
                connectorID: connector.connectorId
              }
            },
            key: `${Utils.randomNumber()}`
          });
        }}>
        <View >
          <View style={style.connectorContainer}>
            <View style={style.connectorDetailContainer}>
              <View style={{ flex: 1 }}>{this.renderFirstConnectorDetails(chargingStation, connector)}</View>
              <View style={{ flex: 1 }}>{this.renderSecondConnectorDetails(chargingStation, connector, style)}</View>
              <View style={{ flex: 1 }}>{this.renderThirdConnectorDetails(chargingStation, connector, style)}</View>
            </View>
            {!chargingStation.inactive && listed && (
              <View style={style.iconContainer}>
                <Icon size={scale(25)} style={style.arrowIcon} as={MaterialCommunityIcons} name="arrow-right-circle-outline" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
