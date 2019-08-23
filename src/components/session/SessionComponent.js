import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Text, View, Icon } from "native-base";
import { TouchableOpacity } from "react-native";
import moment from "moment";
import computeStyleSheet from "./SessionComponentStyles";
import I18n from "../../I18n/I18n";
import * as Animatable from "react-native-animatable";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";
import ProviderFactory from "../../provider/ProviderFactory";
import PropTypes from "prop-types";

let counter = 0;
export default class SessionComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
  }

  render() {
    const style = computeStyleSheet();
    const { session, isAdmin } = this.props;
    const consumption = Math.round(session.stop.totalConsumption / 10) / 100;
    const price = Math.round(session.stop.price * 100) / 100;
    const duration = Utils.formatDurationHHMMSS(session.stop.totalDurationSecs);
    const inactivity = Utils.formatDurationHHMMSS(session.stop.totalInactivitySecs);
    const inactivityStyle = Utils.computeInactivityStyle(session.stop.totalInactivitySecs);
    const navigation = this.props.navigation;
    const sessionID = session.id;
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SessionChartContainer", { sessionID });
          }}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <View style={style.rowContainer}>
                <Text style={style.headerName}>{moment(new Date(session.timestamp)).format("LLL")}</Text>
              </View>
              <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />
            </View>
            <View style={style.subHeader}>
              <Text style={style.subHeaderName}>{session.chargeBoxID}</Text>
              {isAdmin ?
                <Text style={style.subHeaderName}>{session.user.name} {session.user.firstName}</Text>
              :
                undefined
              }
            </View>
            <View style={style.sessionContent}>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="ev-station" style={[style.icon, style.info]} />
                <View style={style.rowContainer}>
                  <Text style={[style.labelValue, style.info]}>{`${consumption} kW.h`}</Text>
                </View>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="timer" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{duration}</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="timer-off" style={[style.icon, inactivityStyle]} />
                <Text style={[style.labelValue, inactivityStyle]}>{inactivity}</Text>
              </View>
              <View style={style.columnContainer}>
                <Icon type="FontAwesome" name="money" style={[style.icon, style.info]} />
                <Text style={[style.labelValue, style.info]}>{price} {session.priceUnit}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

SessionComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

SessionComponent.defaultProps = {};

