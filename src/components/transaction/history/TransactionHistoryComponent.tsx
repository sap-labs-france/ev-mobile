import * as Animatable from "react-native-animatable";
import Icon from "native-base/Icon";
import Text from "native-base/Text";
import View from "native-base/View";
import PropTypes from "prop-types";
import React from "react";
import ResponsiveComponent from "react-native-responsive-ui/ResponsiveComponent";
import TouchableOpacity from "react-native/TouchableOpacity";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import TransactionHeaderComponent from "../header/TransactionHeaderComponent";
import computeStyleSheet from "../TransactionComponentCommonStyles";

let counter = 0;
export default class TransactionHistoryComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
  }

  render() {
    const style = computeStyleSheet();
    const { transaction, isAdmin, isPricingActive } = this.props;
    const consumption = Math.round(transaction.stop.totalConsumption / 10) / 100;
    const price = transaction.stop.price ? Math.round(transaction.stop.price * 100) / 100 : 0;
    const duration = Utils.formatDurationHHMMSS(transaction.stop.totalDurationSecs, false);
    const inactivity = Utils.formatDurationHHMMSS(transaction.stop.totalInactivitySecs, false);
    const inactivityStyle = Utils.computeInactivityStyle(transaction.stop.totalInactivitySecs);
    const batteryLevel = transaction.stateOfCharge ? `${transaction.stateOfCharge} > ${transaction.stop.stateOfCharge}` : "-";
    const navigation = this.props.navigation;
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TransactionChart", { transactionID: transaction.id });
          }}>
          <View style={style.container}>
            <TransactionHeaderComponent transaction={transaction} isAdmin={isAdmin} />
            <View style={style.transactionContent}>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="ev-station" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{consumption}</Text>
                <Text style={[style.subLabelValue, style.info]}>(kW.h)</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="timer" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{duration}</Text>
                <Text style={[style.subLabelValue, style.info]}>(hh:mm)</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="timer-off" style={[style.icon, inactivityStyle]} />
                <Text style={[style.labelValue, inactivityStyle]}>{inactivity}</Text>
                <Text style={[style.subLabelValue, inactivityStyle]}>(hh:mm)</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="battery-charging-full" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{batteryLevel}</Text>
                <Text style={[style.subLabelValue, style.info]}>(%)</Text>
              </View>
              {isPricingActive && (
                <View style={style.columnContainer}>
                  <Icon type="FontAwesome" name="money" style={[style.icon, style.info]} />
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

TransactionHistoryComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
  isPricingActive: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

TransactionHistoryComponent.defaultProps = {};
