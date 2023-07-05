import { View, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import BaseProps from '../../types/BaseProps';
import Reservation from '../../types/Reservation';
import React from 'react';
import computeStyleSheet from './ReservationComponentStyles';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import ReservationHeaderComponent from './header/ReservationHeaderComponent';
import Utils from '../../utils/Utils';
import { scale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface Props extends BaseProps {
  reservation: Reservation;
  isSmartChargingActive: boolean;
  isCarActive: boolean;
  containerStyle?: ViewStyle[];
  isAdmin: boolean;
  isSiteAdmin: boolean;
  visible?: boolean;
}

interface State {}

export default class ReservationComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: this.props?.visible
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
    const { navigation, containerStyle } = this.props;
    const { reservation, isAdmin, isSiteAdmin, isSmartChargingActive, isCarActive } = this.props;
    const connector = Utils.getConnectorFromID(reservation.chargingStation, reservation.connectorID);
    const car = !reservation.car ? '-' : reservation?.car.carCatalog.vehicleModel;
    return (
      <View style={[listItemCommonStyle.container, style.reservationContainer, ...(containerStyle || [])]}>
        <View style={[Utils.getReservationStatusStyle(reservation.status, style), style.statusIndicator]} />
        <TouchableOpacity
          style={style.reservationContent}
          onPress={() => {
            navigation.navigate('ReservationDetailsTabs', {
              params: { reservationID: reservation.id },
              key: `${Utils.randomNumber()}`
            });
          }}>
          <ReservationHeaderComponent navigation={navigation} reservation={reservation} isAdmin={isAdmin} isSiteAdmin={isSiteAdmin} />
          <View style={style.reservationDetailsContainer}>
            <View style={style.connectorDetail}>
              {Utils.buildConnectorTypeSVG(connector?.type, null, 25)}
              <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
            </View>
            <View style={style.reservationDetailContainer}>
              {Utils.buildReservationStatusIcon(reservation.status, style)}
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, style.info]}>
                {Utils.translateReservationStatus(reservation.status)}
              </Text>
            </View>
            <View style={style.reservationDetailContainer}>
              {Utils.buildReservationTypeIcon(reservation.type, style)}
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, style.info]}>
                {Utils.translateReservationType(reservation.type)}
              </Text>
            </View>
            {isCarActive && (
              <View style={style.reservationDetailContainer}>
                <Icon size={scale(25)} as={MaterialIcons} name="directions-car" style={[style.icon, style.info]} />
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, style.info]}>
                  {car}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
