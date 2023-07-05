import { Icon } from 'native-base';
import React from 'react';
import { Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Reservation from '../../../types/Reservation';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './ReservationHeaderComponentStyles';

export interface Props extends BaseProps {
  reservation: Reservation;
  isAdmin: boolean;
  isSiteAdmin: boolean;
  visible?: boolean;
}

interface State {}

export default class ReservationHeaderComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: this.props.visible
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
    const { reservation, isAdmin, isSiteAdmin } = this.props;
    return (
      <View style={style.container}>
        <View style={style.firstLine}>
          <Text numberOfLines={1} style={style.reservationTimeRange}>
            {I18nManager.formatDateTime(reservation.fromDate, { dateStyle: 'short' })} -{' '}
            {I18nManager.formatDateTime(reservation.toDate, { dateStyle: 'short' })}
          </Text>
          <Icon size={scale(18)} style={style.arrowIcon} as={MaterialCommunityIcons} name="arrow-right-circle-outline" />
        </View>
        <Text numberOfLines={1} style={[style.subHeaderName, style.chargingStationName]}>
          {reservation.chargingStationID} - {Utils.getConnectorLetterFromConnectorID(reservation.connectorID)}
        </Text>
        {(isAdmin || isSiteAdmin) && reservation.tag.user && (
          <Text numberOfLines={1} style={[style.subHeaderName, style.userFullName]}>
            {Utils.buildUserName(reservation.tag.user)} ({reservation.tag.user.email})
          </Text>
        )}
      </View>
    );
  }
}
