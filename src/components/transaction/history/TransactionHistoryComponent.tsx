import { Icon } from 'native-base';
import React from 'react';
import { TouchableOpacity, ViewStyle, Text, View } from 'react-native';

import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Transaction from '../../../types/Transaction';
import Utils from '../../../utils/Utils';
import TransactionHeaderComponent from '../header/TransactionHeaderComponent';
import computeStyleSheet from '../TransactionComponentCommonStyles';
import computeListItemCommonStyle from '../../list/ListItemCommonStyle';
import DurationUnitFormat from 'intl-unofficial-duration-unit-format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export interface Props extends BaseProps {
  transaction: Transaction;
  isPricingActive: boolean;
  containerStyle?: ViewStyle[];
  isAdmin: boolean;
  isSiteAdmin: boolean;
  visible?: boolean;
}

interface State {}

export default class TransactionHistoryComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
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
    const { navigation, containerStyle } = this.props;
    const { transaction, isAdmin, isSiteAdmin, isPricingActive } = this.props;
    const consumption = I18nManager.formatNumber(transaction.stop.totalConsumptionWh / 1000, {maximumFractionDigits: 1});
    const totalDurationSecs = transaction.stop.totalDurationSecs;
    const duration = I18nManager.formatDuration(totalDurationSecs, {style: DurationUnitFormat.styles.TIMER});
    const inactivity = I18nManager.formatDuration(transaction.stop.totalInactivitySecs + transaction.stop.extraInactivitySecs, {style: DurationUnitFormat.styles.TIMER});
    const inactivityStyle = Utils.computeInactivityStyle(transaction.stop.inactivityStatus);
    const price = I18nManager.formatCurrency(transaction.stop.roundedPrice, transaction.stop.priceUnit);
    const listItemCommonStyle = computeListItemCommonStyle();
    return (
      <View style={[listItemCommonStyle.container, style.transactionContainer, ...(containerStyle || [])]}>
        <View style={[Utils.getTransactionInactivityStatusStyle(transaction.stop.inactivityStatus, style), style.statusIndicator]} />
        <TouchableOpacity
          style={style.transactionContent}
          onPress={() => {
            navigation.navigate('TransactionDetailsTabs', {
              params: { transactionID: transaction.id },
              key: `${Utils.randomNumber()}`
            });
          }}>
          <TransactionHeaderComponent navigation={navigation} transaction={transaction} isAdmin={isAdmin} isSiteAdmin={isSiteAdmin} />
          <View style={style.transactionDetailsContainer}>
            <View style={style.transactionDetailContainer}>
              <Icon size={scale(25)} as={MaterialIcons} name="ev-station" style={[style.icon, style.info]} />
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, style.info]}>{consumption} kW.h</Text>
            </View>
            <View style={style.transactionDetailContainer}>
              <Icon size={scale(25)} as={MaterialIcons} name="timer" style={[style.icon, style.info]} />
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, style.info]}>{duration}</Text>
            </View>
            <View style={style.transactionDetailContainer}>
              <Icon size={scale(25)} as={MaterialIcons} name="timer-off" style={[style.icon, inactivityStyle]} />
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, inactivityStyle]}>{inactivity}</Text>
            </View>
            {isPricingActive && (
              <View style={style.transactionDetailContainer}>
                <Icon size={scale(25)} as={MaterialIcons} name="money" style={[style.icon, style.info]} />
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.labelValue, style.info]}>
                  {price}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
