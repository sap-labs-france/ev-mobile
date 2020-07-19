import I18n from 'i18n-js';
import moment from 'moment';
import { Button, Icon, Text, View } from 'native-base';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import Utils from '../../utils/Utils';
import computeStyleSheet from './ChargerComponentStyles';
import ChargerConnectorComponent from './connector/ChargerConnectorComponent';

export interface Props extends BaseProps {
  charger: ChargingStation;
  isAdmin: boolean;
  isSiteAdmin: boolean;
}

interface State {
}

export default class ChargerComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public showHeartbeatStatus = () => {
    const { charger } = this.props;
    let message = I18n.t('chargers.heartBeatOkMessage', { chargeBoxID: charger.id });
    if (charger.inactive) {
      message = I18n.t('chargers.heartBeatKoMessage', {
        chargeBoxID: charger.id,
        lastHeartBeat: moment(new Date(charger.lastHeartBeat),null, true).fromNow(true)
      });
    }
    Alert.alert(I18n.t('chargers.heartBeat'), message, [{ text: I18n.t('general.ok') }]);
  };

  public render() {
    const style = computeStyleSheet();
    const { charger, isAdmin, isSiteAdmin, navigation } = this.props;
    const validGPSCoordinates = Utils.containsGPSCoordinates(charger.coordinates);
    return (
      <View style={style.container}>
        <View style={style.headerContent}>
          <View style={style.subHeaderContent}>
            <TouchableOpacity disabled={!validGPSCoordinates}
                onPress={() => Utils.jumpToMapWithCoordinates(charger.id, charger.coordinates)}>
              { validGPSCoordinates ?
                <Icon style={[style.icon, style.iconLeft]} type='MaterialIcons' name='place' />
              :
                <Icon style={[style.icon, style.iconLeft]} type='MaterialCommunityIcons' name='map-marker-off' />
              }
            </TouchableOpacity>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>{charger.id}</Text>
          </View>
          <View style={style.buttonContainer}>
            {(isAdmin || isSiteAdmin) &&
              <Button transparent={true} style={style.button}
                onPress={() => {
                  navigation.navigate({
                    routeName: 'ChargerDetailsTabs',
                    params: {
                      chargerID: charger.id
                    },
                    key: `${Utils.randomNumber()}`
                  })
                }}>
                <Icon style={[style.icon, style.iconRight, style.iconSettings]} type='MaterialIcons' name='tune' />
              </Button>
            }
            <Button transparent={true} style={[style.button, style.buttonRight]} onPress={() => { this.showHeartbeatStatus(); }}>
              {charger.inactive ?
                <Animatable.Text animation='fadeIn' easing='ease-in-out' iterationCount='infinite' direction='alternate-reverse'>
                  <Icon style={style.deadHeartbeatIcon} type='FontAwesome' name='heartbeat' />
                </Animatable.Text>
              :
                <Animatable.Text animation='pulse' easing='ease-out' iterationCount='infinite' style={{ textAlign: 'center' }}>
                  <Icon style={style.heartbeatIcon} type='FontAwesome' name='heartbeat' />
                </Animatable.Text>
              }
            </Button>
          </View>
        </View>
        <View style={style.connectorsContainer}>
          {charger.connectors.map((connector) => (
            <ChargerConnectorComponent
              key={`${charger.id}~${connector.connectorId}`}
              charger={charger}
              connector={connector}
              navigation={navigation}
            />
          ))}
        </View>
      </View>
    );
  }
}
