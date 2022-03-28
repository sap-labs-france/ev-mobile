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

export default class TransactionInProgressComponent extends React.Component<Props, State> {
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
    const { transaction, isAdmin, isSiteAdmin, isPricingActive, containerStyle } = this.props;
    const consumption = Math.round(transaction.currentInstantWatts / 10) / 100;
    const totalConsumption = Math.round(transaction.currentTotalConsumptionWh / 10) / 100;
    const price = transaction.currentCumulatedPrice ? Utils.roundTo(transaction.currentCumulatedPrice, 2) : 0;
    const duration = Utils.formatDurationHHMMSS(transaction.currentTotalDurationSecs, false);
    const inactivity = Utils.formatDurationHHMMSS(transaction.currentTotalInactivitySecs, false);
    const inactivityStyle = Utils.computeInactivityStyle(transaction.currentInactivityStatus);
    const batteryLevel = transaction.stateOfCharge ? `${transaction.stateOfCharge} > ${transaction.currentStateOfCharge}` : '-';
    const navigation = this.props.navigation;
    const listItemCommonStyle = computeListItemCommonStyle();
    return (
      <View style={[listItemCommonStyle.container, style.transactionContainer, ...(containerStyle || [])]}>
        <View style={[Utils.getTransactionInactivityStatusStyle(transaction.currentInactivityStatus, style), style.statusIndicator]} />
        <TouchableOpacity
          style={style.transactionContent}
          onPress={() => {
            navigation.navigate('ChargingStationConnectorDetailsTabs', {
              params: {
                chargingStationID: transaction.chargeBoxID,
                connectorID: transaction.connectorId
              },
              key: `${Utils.randomNumber()}`
            });
          }}>
          <View style={style.leftContainer}>
            <TransactionHeaderComponent navigation={navigation} transaction={transaction} isAdmin={isAdmin} isSiteAdmin={isSiteAdmin} />
            <View style={[style.transactionDetailsContainer, style.transactionDetailsContainer1]}>
              <View style={style.transactionDetailContainer}>
                <Icon type="FontAwesome" name="bolt" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{I18nManager.formatNumber(consumption)}</Text>
                <Text style={[style.subLabelValue, style.info]}>(kW)</Text>
              </View>
              <View style={style.transactionDetailContainer}>
                <Icon type="MaterialIcons" name="ev-station" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{I18nManager.formatNumber(totalConsumption)}</Text>
                <Text style={[style.subLabelValue, style.info]}>(kW.h)</Text>
              </View>
              <View style={style.transactionDetailContainer}>
                <Icon type="MaterialIcons" name="battery-charging-full" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{batteryLevel}</Text>
                <Text style={[style.subLabelValue, style.info]}>(%)</Text>
              </View>
            </View>
            <View style={[style.transactionDetailsContainer, style.transactionDetailsContainer2]}>
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
                  <Text style={[style.labelValue, style.info]}>{price}</Text>
                  <Text style={[style.subLabelValue, style.info]}>({transaction.priceUnit})</Text>
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
