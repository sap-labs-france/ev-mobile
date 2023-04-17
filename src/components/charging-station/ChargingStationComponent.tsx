import I18n from 'i18n-js';
import moment from 'moment';
import { Icon } from 'native-base';
import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import Utils from '../../utils/Utils';
import computeStyleSheet from './ChargingStationComponentStyles';
import ChargingStationConnectorComponent from './connector/ChargingStationConnectorComponent';
import DialogModal from '../modal/DialogModal';
import computeModalCommonStyle from '../modal/ModalCommonStyle';
import I18nManager from '../../I18n/I18nManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {
  chargingStation: ChargingStation;
  isAdmin: boolean;
  isSiteAdmin: boolean;
  onNavigate?: () => void;
}

interface State {
  showHeartbeatDialog: boolean;
}

export default class ChargingStationComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
    this.state = {
      showHeartbeatDialog: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { chargingStation, isAdmin, isSiteAdmin, navigation, onNavigate } = this.props;
    const { showHeartbeatDialog } = this.state;
    const validGPSCoordinates = Utils.containsGPSCoordinates(chargingStation.coordinates);
    return (
      <View style={style.container}>
        {showHeartbeatDialog && this.renderHeartbeatStatusDialog()}
        <View style={style.headerContent}>
          <View style={style.titleContainer}>
            <TouchableOpacity
              disabled={!validGPSCoordinates}
              onPress={() => Utils.jumpToMapWithCoordinates(chargingStation.id, chargingStation.coordinates)}>
              {validGPSCoordinates ? (
                <Icon size={scale(30)} style={[style.icon, style.iconLeft]} as={MaterialCommunityIcons} name="directions" />
              ) : (
                <Icon size={scale(30)} style={[style.icon, style.iconLeft]} as={MaterialCommunityIcons} name="map-marker-off" />
              )}
            </TouchableOpacity>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>
              {chargingStation.id}
            </Text>
          </View>
          <View style={style.buttonContainer}>
            {(isAdmin || isSiteAdmin) && (
              <TouchableOpacity
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
                <Icon size={scale(30)} style={[style.icon, style.iconRight, style.settingsIcon]} as={MaterialIcons} name="tune" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                this.setState({ showHeartbeatDialog: true });
              }}>
              {chargingStation.inactive ? (
                <Animatable.Text animation="fadeIn" easing="ease-in-out" iterationCount="infinite" direction="alternate-reverse">
                  <Icon size={scale(30)} style={style.deadHeartbeatIcon} as={FontAwesome} name="heartbeat" />
                </Animatable.Text>
              ) : (
                <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>
                  <Icon size={scale(30)} style={style.heartbeatIcon} as={FontAwesome} name="heartbeat" />
                </Animatable.Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={style.subHeaderContent}>
          {chargingStation.siteArea && (
            <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={1}>
              {Utils.formatAddress(chargingStation.siteArea?.address)}
            </Text>
          )}
          {chargingStation.distanceMeters > 0 && <Text style={style.distance}>{I18nManager.formatDistance(chargingStation.distanceMeters)}</Text>}
        </View>
        <ScrollView contentContainerStyle={style.connectorsContent} style={style.connectorsContainer}>
          {chargingStation.connectors.map(
            (connector) =>
              connector && (
                <ChargingStationConnectorComponent
                  onNavigate={onNavigate}
                  listed={true}
                  key={`${chargingStation.id}~${connector.connectorId}`}
                  chargingStation={chargingStation}
                  connector={connector}
                  navigation={navigation}
                />
              )
          )}
        </ScrollView>
      </View>
    );
  }

  private renderHeartbeatStatusDialog() {
    const { chargingStation } = this.props;
    const modalCommonStyle = computeModalCommonStyle();
    let message = I18n.t('chargers.heartBeatOkMessage', { chargeBoxID: chargingStation.id });
    if (chargingStation.inactive) {
      message = I18n.t('chargers.heartBeatKoMessage', {
        chargeBoxID: chargingStation.id,
        lastSeen: moment(new Date(chargingStation.lastSeen), null, true).fromNow(true)
      });
    }
    return (
      <DialogModal
        title={I18n.t('chargers.heartBeat')}
        onBackDropPress={() => this.setState({ showHeartbeatDialog: false })}
        onBackButtonPressed={() => this.setState({ showHeartbeatDialog: false })}
        description={message}
        buttons={[
          {
            text: I18n.t('general.ok'),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            action: () => this.setState({ showHeartbeatDialog: false })
          }
        ]}
      />
    );
  }
}
