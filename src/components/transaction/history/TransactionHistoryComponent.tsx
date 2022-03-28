import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Transaction from '../../../types/Transaction';
import Utils from '../../../utils/Utils';
import TransactionHeaderComponent from '../header/TransactionHeaderComponent';
import computeStyleSheet from '../TransactionComponentCommonStyles';
import computeListItemCommonStyle from '../../list/ListItemCommonStyle';

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
    const consumption = Math.round(transaction.stop.totalConsumptionWh / 10) / 100;
    const duration = Utils.formatDurationHHMMSS(transaction.stop.totalDurationSecs, false);
    const inactivity = Utils.formatDurationHHMMSS(transaction.stop.totalInactivitySecs + transaction.stop.extraInactivitySecs, false);
    const inactivityStyle = Utils.computeInactivityStyle(transaction.stop.inactivityStatus);
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
          <View style={style.leftContainer}>
            <TransactionHeaderComponent navigation={navigation} transaction={transaction} isAdmin={isAdmin} isSiteAdmin={isSiteAdmin} />
            <View style={style.transactionDetailsContainer}>
              <View style={style.transactionDetailContainer}>
                <Icon type="MaterialIcons" name="ev-station" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{I18nManager.formatNumber(consumption)}</Text>
                <Text style={[style.subLabelValue, style.info]}>(kW.h)</Text>
              </View>
              <View style={style.transactionDetailContainer}>
                <Icon type="MaterialIcons" name="timer" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{duration}</Text>
                <Text style={[style.subLabelValue, style.info]}>(hh:mm)</Text>
              </View>
              <View style={style.transactionDetailContainer}>
                <Icon type="MaterialIcons" name="timer-off" style={[style.icon, inactivityStyle]} />
                <Text style={[style.labelValue, inactivityStyle]}>{inactivity}</Text>
                <Text style={[style.subLabelValue, inactivityStyle]}>(hh:mm)</Text>
              </View>
              {isPricingActive && (
                <View style={style.transactionDetailContainer}>
                  <Icon type="FontAwesome" name="money" style={[style.icon, style.info]} />
                  <Text style={[style.labelValue, style.info]}>
                    {I18nManager.formatCurrency(transaction.stop.roundedPrice, transaction.stop.priceUnit)}
                  </Text>
                  <Text style={[style.subLabelValue, style.info]}>({transaction.stop.priceUnit})</Text>
                </View>
              )}
            </View>
          </View>
          <View style={style.rightContainer}>
            <Icon style={[style.icon, style.arrowIcon]} type="MaterialIcons" name="navigate-next" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
