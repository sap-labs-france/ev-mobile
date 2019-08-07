import React from "react";
import { Text, View, Icon, Button } from "native-base";
import { Alert } from "react-native";
import moment from "moment";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ChargerComponentStyles";
import * as Animatable from "react-native-animatable";
import ConnectorComponent from "./connector/ConnectorComponent";
import PropTypes from "prop-types";
import I18n from "../../I18n/I18n";

export default class ChargerComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChargerDead: false,
    };
  }

  componentDidMount() {
    const { charger } = this.props;
    // Check if charger is dead
    this._checkHeartbeat();
  }

  _checkHeartbeat = () => {
    const { charger } = this.props;
    const lastHeartbeatMinutes = new Date(charger.lastHeartBeat).getMinutes();
    // Is last heartbeat has been sent more than 5 minutes ago ?
    if (new Date().getMinutes() - lastHeartbeatMinutes > 5) {
      this.setState({ isChargerDead: true });
    } else {
      this.setState({ isChargerDead: false });
    }
  };

  _showHeartbeatStatus = () => {
    const { charger } = this.props;
    const { isChargerDead } = this.state;
    let message = I18n.t("chargers.heartBeatOkMessage", { chargeBoxID: charger.id });
    if (isChargerDead) {
      message = I18n.t("chargers.heartBeatKoMessage", {
        chargeBoxID: charger.id,
        lastHeartBeat: moment(new Date(charger.lastHeartBeat), true).fromNow(true),
      });
    }
    Alert.alert(I18n.t("chargers.heartBeat"), message, [{ text: I18n.t("general.ok") }]);
  };

  render() {
    const style = computeStyleSheet();
    const { charger, navigation, siteAreaID } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={style.container}>
        <View style={style.headerContent}>
          <Text style={style.name}>{charger.id}</Text>
          {isChargerDead ? (
            <Button
              transparent
              style={style.heartbeatButton}
              onPress={() => {
                this._showHeartbeatStatus();
              }}>
              <Animatable.Text
                animation="fadeIn"
                easing="ease-in-out"
                iterationCount="infinite"
                direction="alternate-reverse">
                <Icon style={style.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
              </Animatable.Text>
            </Button>
          ) : (
            <Button
              transparent
              style={style.heartbeatButton}
              onPress={() => {
                this._showHeartbeatStatus();
              }}>
              <Animatable.Text
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                style={{ textAlign: "center" }}>
                <Icon style={style.heartbeatIcon} type="FontAwesome" name="heartbeat" />
              </Animatable.Text>
            </Button>
          )}
        </View>
        <View style={style.connectorsContainer}>
          {charger.connectors.map((connector, index) => {
            return (
              <ConnectorComponent
                key={`${charger.id}~${connector.connectorId}`}
                charger={charger}
                connector={connector}
                siteAreaID={siteAreaID}
                index={index}
                navigation={navigation}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

ChargerComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  charger: PropTypes.object.isRequired,
};

ChargerComponent.defaultProps = {};
