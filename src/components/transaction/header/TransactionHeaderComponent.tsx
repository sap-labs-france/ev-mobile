import { Icon } from 'native-base';
import React from 'react';
import { Text, View } from 'react-native';

import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Transaction from '../../../types/Transaction';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './TransactionHeaderComponentStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {
  transaction: Transaction;
  isAdmin: boolean;
  isSiteAdmin: boolean;
  visible?: boolean;
}

interface State {}
export default class TransactionHeaderComponent extends React.Component<Props, State> {
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
    const { transaction, isAdmin, isSiteAdmin } = this.props;
    return (
      <View style={style.container}>
        <View style={style.firstLine}>
          <Text numberOfLines={1} style={style.transactionTimestamp}>{I18nManager.formatDateTime(transaction.timestamp, {dateStyle: 'medium', timeStyle: 'short'})}</Text>
          <Icon size={scale(18)} style={style.arrowIcon} as={MaterialCommunityIcons} name="arrow-right-circle-outline" />
        </View>
        <Text numberOfLines={1} style={[style.subHeaderName, style.chargingStationName]}>
          {transaction.chargeBoxID} - {Utils.getConnectorLetterFromConnectorID(transaction.connectorId)}
        </Text>
        {(isAdmin || isSiteAdmin) && transaction.user && (
          <Text numberOfLines={1} style={[style.subHeaderName, style.userFullName]}>
            {Utils.buildUserName(transaction.user)} ({transaction.user.email})
          </Text>
        )}
      </View>
    );
  }
}
