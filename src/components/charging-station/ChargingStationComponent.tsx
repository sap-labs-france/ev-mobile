import I18n from 'i18n-js';
import moment from 'moment';
import { Button, Icon, Text, View } from 'native-base';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import Utils from '../../utils/Utils';
import computeStyleSheet from './ChargingStationComponentStyles';
import ChargingStationConnectorComponent from './connector/ChargingStationConnectorComponent';

export interface Props extends BaseProps {
  chargingStation: ChargingStation;
  isAdmin: boolean;
  isSiteAdmin: boolean;
  onNavigate?: () => void;
}

interface State {}

export default class ChargingStationComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public showHeartbeatStatus = () => {
    const { chargingStation } = this.props;
    let message = I18n.t('chargers.heartBeatOkMessage', { chargeBoxID: chargingStation.id });
    if (chargingStation.inactive) {
      message = I18n.t('chargers.heartBeatKoMessage', {
        chargeBoxID: chargingStation.id,
        lastSeen: moment(new Date(chargingStation.lastSeen), null, true).fromNow(true)
      });
    }
    Alert.alert(I18n.t('chargers.heartBeat'), message, [{ text: I18n.t('general.ok') }]);
  };

  public render() {
    const style = computeStyleSheet();
    const { chargingStation, isAdmin, isSiteAdmin, navigation, onNavigate } = this.props;
    const validGPSCoordinates = Utils.containsGPSCoordinates(chargingStation.coordinates);
    return (
      <View style={style.container}>
        <View style={style.headerContent}>
          <View style={style.titleContainer}>
            <TouchableOpacity
              disabled={!validGPSCoordinates}
              onPress={() => Utils.jumpToMapWithCoordinates(chargingStation.id, chargingStation.coordinates)}>
              {validGPSCoordinates ? (
                <Icon style={[style.icon, style.iconLeft]} type="MaterialIcons" name="place" />
              ) : (
                <Icon style={[style.icon, style.iconLeft]} type="MaterialCommunityIcons" name="map-marker-off" />
              )}
            </TouchableOpacity>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>
              {chargingStation.id}
            </Text>
          </View>
          <View style={style.buttonContainer}>
            {(isAdmin || isSiteAdmin) && (
              <Button
                transparent
                style={style.button}
                onPress={() => {
                  if (onNavigate) {
                    onNavigate();
                  }
                  navigation.navigate('ChargingStationDetailsTabs', {
                    params: {
                      chargingStationID: chargingStation.id
                    },
                    key: `${Utils.randomNumber()}`
                  });
                }}>
                <Icon style={[style.icon, style.iconRight, style.iconSettings]} type="MaterialIcons" name="tune" />
              </Button>
            )}
            <Button
              transparent
              style={[style.button, style.buttonRight]}
              onPress={() => {
                this.showHeartbeatStatus();
              }}>
              {chargingStation.inactive ? (
                <Animatable.Text animation="fadeIn" easing="ease-in-out" iterationCount="infinite" direction="alternate-reverse">
                  <Icon style={style.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
                </Animatable.Text>
              ) : (
                <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>
                  <Icon style={style.heartbeatIcon} type="FontAwesome" name="heartbeat" />
                </Animatable.Text>
              )}
            </Button>
          </View>
        </View>
        <View style={style.subHeaderContent}>
          {chargingStation.siteArea ? (
            <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={1}>
              {Utils.formatAddress(chargingStation.siteArea.address)}
            </Text>
          ) : (
            <Text>-</Text>
          )}
          {chargingStation.distanceMeters > 0 && <Text style={style.distance}>{Utils.formatDistance(chargingStation.distanceMeters)}</Text>}
        </View>
        <View style={style.connectorsContainer}>
          {chargingStation.connectors.map(
            (connector) =>
              connector && (
                <ChargingStationConnectorComponent
                  onNavigate={onNavigate}
                  key={`${chargingStation.id}~${connector.connectorId}`}
                  chargingStation={chargingStation}
                  connector={connector}
                  navigation={navigation}
                />
              )
          )}
        </View>
      </View>
    );
  }
}
