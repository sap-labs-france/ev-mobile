import React from "react";
import { Text, View, Icon } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./styles";
import * as Animatable from "react-native-animatable";
import ConnectorComponent from "../Connector";

class ChargerComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      siteImage: this.props.navigation.state.params.siteImage,
      isChargerDead: false
    };
  }

  componentDidMount() {
    const { charger } = this.props;
    // Check if charger is dead
    this._checkHeartbeat(charger);
  }

  _checkHeartbeat = (charger, minutesNow) => {
    let lastHeartbeatMinutes = new Date(charger.lastHeartBeat).getMinutes();
    // Is last heartbeat has been sent more than 5 minutes ago ?
    if ((new Date().getMinutes() - lastHeartbeatMinutes) > 5) {
      // Yes: Charger is dead
      this.setState({ isChargerDead: true });
    } else {
      // No: It doesn't
      this.setState({ isChargerDead: false });
    }
  }

  render() {
    const style = computeStyleSheet();
    const { charger, navigation, siteID, siteImage } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={style.container}>
        <View style={style.chargerContainer}>
          <Text style={style.chargerName}>{charger.id}</Text>
          { isChargerDead ?
            <Animatable.Text animation="fadeIn" easing="ease-in-out" duration="1000" iterationCount="infinite" direction="alternate-reverse">
              <Icon style={style.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
            </Animatable.Text>
          :
            <Icon style={style.heartbeatIcon} type="FontAwesome" name="heartbeat" />
          }
        </View>
        <View style={style.connectorsContainer}>
          {
            charger.connectors.map((connector, index) => {
              return (<ConnectorComponent
                key={`${charger.id}~${connector.connectorId}` } 
                index={index} connector={connector} 
                navigation={navigation} charger={charger} 
                siteID={siteID} siteImage={siteImage}/>);
            })
          }
        </View>
      </View>
    );
  }
}

export default ChargerComponent;
