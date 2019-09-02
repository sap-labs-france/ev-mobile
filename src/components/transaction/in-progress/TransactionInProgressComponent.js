import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Text, View, Icon } from "native-base";
import { TouchableOpacity } from "react-native";
import computeStyleSheet from "../TransactionComponentCommonStyles";
import * as Animatable from "react-native-animatable";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import PropTypes from "prop-types";
import TransactionHeaderComponent from "../header/TransactionHeaderComponent";

let counter = 0;
export default class TransactionInProgressComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
  }

  render() {
    const style = computeStyleSheet();
    const { transaction, isAdmin, isPricingActive } = this.props;
    const consumption = Math.round(transaction.currentTotalConsumption / 10) / 100;
    const price = transaction.currentCumulatedPrice ? Math.round(transaction.currentCumulatedPrice * 100) / 100 : 0;
    const duration = Utils.formatDurationHHMMSS(transaction.currentTotalDurationSecs, false);
    const inactivity = Utils.formatDurationHHMMSS(transaction.currentTotalInactivitySecs, false);
    const inactivityStyle = Utils.computeInactivityStyle(transaction.currentTotalInactivitySecs);
    const batteryLevel = transaction.currentStateOfCharge ? transaction.currentStateOfCharge : "-";
    const navigation = this.props.navigation;
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ChargerDetailsTabs", {
              chargerID: transaction.chargeBoxID,
              connectorID: transaction.connectorId
            })
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
              {isPricingActive &&
                <View style={style.columnContainer}>
                  <Icon type="FontAwesome" name="money" style={[style.icon, style.info]} />
                  <Text style={[style.labelValue, style.info]}>{price}</Text>
                  <Text style={[style.subLabelValue, style.info]}>({transaction.priceUnit})</Text>
                </View>
              }
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

TransactionInProgressComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
  isPricingActive: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

TransactionInProgressComponent.defaultProps = {};

