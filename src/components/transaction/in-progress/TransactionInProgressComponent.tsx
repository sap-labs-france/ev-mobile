import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import TransactionHeaderComponent from '../header/TransactionHeaderComponent';
import computeStyleSheet from '../TransactionComponentCommonStyles';

export interface Props extends BaseProps {
  transaction: Transaction;
  isPricingActive: boolean;
  isAdmin: boolean;
  isSiteAdmin: boolean;
  visible?: boolean;
}

interface State {
}

export default class TransactionInProgressComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private counter: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: this.props.visible
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { transaction, isAdmin, isSiteAdmin, isPricingActive } = this.props;
    const consumption = Math.round(transaction.currentInstantWatts / 10) / 100;
    const totalConsumption = Math.round(transaction.currentTotalConsumptionWh / 10) / 100;
    const price = transaction.currentCumulatedPrice ? Math.round(transaction.currentCumulatedPrice * 100) / 100 : 0;
    const duration = Utils.formatDurationHHMMSS(transaction.currentTotalDurationSecs, false);
    const inactivity = Utils.formatDurationHHMMSS(transaction.currentTotalInactivitySecs, false);
    const inactivityStyle = Utils.computeInactivityStyle(transaction.currentInactivityStatus);
    const batteryLevel = transaction.stateOfCharge ? `${transaction.stateOfCharge} > ${transaction.currentStateOfCharge}` : '-';
    const navigation = this.props.navigation;
    return (
      <Animatable.View
        animation={this.counter++ % 2 === 0 ? 'flipInX' : 'flipInX'}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate({
              routeName: 'ChargerConnectorDetailsTabs',
              params: {
                chargerID: transaction.chargeBoxID,
                connectorID: transaction.connectorId
              },
              key: `${Utils.randomNumber()}`
            });
          }}>
          <View style={style.container}>
            <TransactionHeaderComponent navigation={navigation} transaction={transaction} isAdmin={isAdmin} isSiteAdmin={isSiteAdmin} />
            <View style={style.transactionContent}>
              <View style={style.columnContainer}>
                <Icon type='FontAwesome' name='bolt' style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{I18nManager.formatNumber(consumption)}</Text>
                <Text style={[style.subLabelValue, style.info]}>(kW)</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type='MaterialIcons' name='ev-station' style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{I18nManager.formatNumber(totalConsumption)}</Text>
                <Text style={[style.subLabelValue, style.info]}>(kW.h)</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type='MaterialIcons' name='battery-charging-full' style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{batteryLevel}</Text>
                <Text style={[style.subLabelValue, style.info]}>(%)</Text>
              </View>
            </View>
            <View style={style.transactionContent}>
            <View style={style.columnContainer}>
                <Icon type='MaterialIcons' name='timer' style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{duration}</Text>
                <Text style={[style.subLabelValue, style.info]}>(hh:mm)</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type='MaterialIcons' name='timer-off' style={[style.icon, inactivityStyle]} />
                <Text style={[style.labelValue, inactivityStyle]}>{inactivity}</Text>
                <Text style={[style.subLabelValue, inactivityStyle]}>(hh:mm)</Text>
              </View>
              {isPricingActive && (
                <View style={style.columnContainer}>
                  <Icon type='FontAwesome' name='money' style={[style.icon, style.info]} />
                  <Text style={[style.labelValue, style.info]}>{price}</Text>
                  <Text style={[style.subLabelValue, style.info]}>({transaction.priceUnit})</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
