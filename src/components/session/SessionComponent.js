import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Text, View, Icon } from "native-base";
import { TouchableOpacity } from "react-native";
import moment from "moment";
import computeStyleSheet from "./SessionComponentStyles";
import I18n from "../../I18n/I18n";
import * as Animatable from "react-native-animatable";
import Constants from "../../utils/Constants";
import ChargerChartDetails from "../../screens/charger-details/chart/ChargerChartDetails";

let counter = 0;
export default class SessionComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
    this.searchText = "";
    this.searchChanged = false;
  }

  _formatTimer = (val) => {
    // Put 0 next to the digit if lower than 10
    const valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    }
    // Return new digit
    return valString;
  };

  _formatDurationHHMMSS = (durationSecs) => {
    if (durationSecs <= 0) {
      return "00:00:00";
    }
    // Set Hours
    const hours = Math.trunc(durationSecs / 3600);
    durationSecs -= hours * 3600;
    // Set Mins
    let minutes = 0;
    if (durationSecs > 0) {
      minutes = Math.trunc(durationSecs / 60);
      durationSecs -= minutes * 60;
    }
    // Set Secs
    const seconds = Math.trunc(durationSecs);
    // Format
    return `${this._formatTimer(hours)}:${this._formatTimer(minutes)}:${this._formatTimer(seconds)}`;
  };

  _navigateTo = (screen, params = {}) => {
    // Navigate
    this.props.navigation.navigate({ routeName: screen, params });
    // Close
    this.props.navigation.closeDrawer();
  };

  render() {
    const style = computeStyleSheet();
    const session = this.props.session;
    const sessionDate = moment(new Date(session.timestamp));
    const consumption = Math.round(session.stop.totalConsumption / 10) / 100;
    const price = Math.round(session.stop.price * 100) / 100;
    const duration = this._formatDurationHHMMSS(session.stop.totalDurationSecs);
    const inactivity = this._formatDurationHHMMSS(session.stop.totalInactivitySecs);
    const navigation = this.props.navigation;
    const transactionId = session.id;
    const siteID = session.siteID;
    const siteAreaID = session.siteAreaID;
    const connectorID = session.connectorId;
    const chargerID = session.chargeBoxID;
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ChartHistory", { transactionId });
            navigation.closeDrawer();
          }}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <View style={style.rowContainer}>
                <Icon style={style.linkIcon} type="MaterialCommunityIcons" name="history" />
                <Text style={style.name}>{sessionDate.format("LLL")}</Text>
              </View>
              <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />
            </View>
            <View style={style.stationHeader}>
              <Text>{session.chargeBoxID}</Text>
            </View>
            <View style={style.sessionContent}>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="battery-charging-full" style={style.icon} />
                <View style={style.rowContainer}>
                  <Text style={style.value}>{`${consumption} kW`}</Text>
                </View>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="timer" style={style.icon} />
                <Text style={[style.value, style.labelTimeValue]}>{duration}</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="timer-off" style={style.icon} />
                <Text style={[style.value, style.labelTimeValue]}>{inactivity}</Text>
              </View>

              <View style={style.columnContainer}>
                <Icon type="FontAwesome" name="euro" style={style.icon} />
                <Text style={[style.value, style.labelTimeValue]}>{price}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
