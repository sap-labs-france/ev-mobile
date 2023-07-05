import I18n from 'i18n-js';
import moment from 'moment';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { scale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DialogModal from '../../components/modal/DialogModal';
import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import Utils from '../../utils/Utils';
import computeModalCommonStyle from '../modal/ModalCommonStyle';
import computeStyleSheet from './ReservableChargingStationComponentStyles';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';

export interface Props extends BaseProps {
  chargingStation: ChargingStation;
  selected?: boolean;
  containerStyle?: ViewStyle[];
}

interface State {
  showHeartbeatDialog: boolean;
}

export default class ReservableChargingStationComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

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
    const listItemCommonStyle = computeListItemCommonStyle();
    const { chargingStation, containerStyle } = this.props;
    const { showHeartbeatDialog } = this.state;
    return (
      <View style={[listItemCommonStyle.container, style.chargingStationContainer, ...(containerStyle || [])]}>
        {showHeartbeatDialog && this.renderHeartbeatStatusDialog()}
        <View style={style.evIconContainer}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showHeartbeatDialog: true });
            }}>
            {chargingStation.inactive ? (
              <Animatable.Text animation="fadeIn" easing="ease-in-out" iterationCount="infinite" direction="alternate-reverse">
                <Icon size={scale(35)} style={style.deadEvStationIcon} as={MaterialCommunityIcons} name="ev-station" />
              </Animatable.Text>
            ) : (
              <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>
                <Icon size={scale(35)} style={style.evStationIcon} as={MaterialCommunityIcons} name="ev-station" />
              </Animatable.Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={style.contentContainer}>
          <Text ellipsizeMode={'tail'} numberOfLines={1} style={[style.title, style.headerName]}>
            {chargingStation.id}
          </Text>
          {chargingStation.siteArea && (
            <Text style={style.text} ellipsizeMode={'tail'} numberOfLines={1}>
              {Utils.formatAddress(chargingStation.siteArea?.address)}
            </Text>
          )}
          <View style={style.bottomLine}>
            {chargingStation.connectors.map((connector) => (
              <View
                key={`${chargingStation.id}~${connector.connectorId}`}
                style={[Utils.buildConnectorTypeStyle(connector.type), style.defaultContainer]}>
                <Text style={[style.defaultText]}>{Utils.translateConnectorType(connector.type)}</Text>
              </View>
            ))}
          </View>
        </View>
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
  private renderChargingStationConnectors(style: any, chargingStation: ChargingStation) {
    return chargingStation.connectors.map((connector) => (
      <View key={`${chargingStation.id}~${connector.connectorId}`} style={[style.defaultContainer]}>
        <Text style={[style.defaultText, Utils.buildConnectorTypeStyle(connector.type)]}>
          {Utils.translateConnectorType(connector.type)}
        </Text>
      </View>
    ));
  }
}
