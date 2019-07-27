import React from "react";
import { Text, View, Icon } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ChargerComponentStyles";
import * as Animatable from "react-native-animatable";
import ConnectorComponent from "./connector/ConnectorComponent";
import PropTypes from "prop-types";

export default class ChargerComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChargerDead: false
    };
  }

  componentDidMount() {
    const { charger } = this.props;
    // Check if charger is dead
    this._checkHeartbeat(charger);
  }

  _checkHeartbeat = charger => {
    const lastHeartbeatMinutes = new Date(charger.lastHeartBeat).getMinutes();
    // Is last heartbeat has been sent more than 5 minutes ago ?
    if (new Date().getMinutes() - lastHeartbeatMinutes > 5) {
      // Yes: Charger is dead
      this.setState({ isChargerDead: true });
    } else {
      // No: It doesn't
      this.setState({ isChargerDead: false });
    }
  };

  render() {
    const style = computeStyleSheet();
    const { charger, navigation, siteAreaID } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={style.container}>
        <View style={style.chargerContainer}>
          <Text style={style.name}>{charger.id}</Text>
          {isChargerDead ? (
            <Animatable.Text
              animation="fadeIn"
              easing="ease-in-out"
              iterationCount="infinite"
              direction="alternate-reverse"
            >
              <Icon style={style.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
            </Animatable.Text>
          ) : (
            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={{ textAlign: "center" }}
            >
              <Icon style={style.heartbeatIcon} type="FontAwesome" name="heartbeat" />
            </Animatable.Text>
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
  charger: PropTypes.object.isRequired
};

ChargerComponent.defaultProps = {};
