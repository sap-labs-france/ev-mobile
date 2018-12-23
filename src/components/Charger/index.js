import React from "react";
import { FlatList } from "react-native";
import { Text, View, Icon } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./styles";
import * as Animatable from "react-native-animatable";
import ConnectorComponent from "../Connector";

class ChargerComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChargerDead: false
    };
  }

  componentDidMount() {
    const { items } = this.props;
    // Check if charger is dead
    this._checkHeartbeat(items);
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

  _renderItem = ({item, index}, charger, navigation, siteID) => {
    return (
      <ConnectorComponent index={index} item={item} nav={navigation} charger={charger} siteID={siteID} />
    );
  }

  render() {
    const style = computeStyleSheet();
    const { items, nav, siteID } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={style.container}>
        <View style={style.chargerContainer}>
          <Text style={style.chargerName}>{items.id}</Text>
          { isChargerDead ?
            <Animatable.Text animation="fadeIn" easing="ease-in-out" useNativeDriver="true" duration="1000" iterationCount="infinite" direction="alternate-reverse">
              <Icon style={style.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
            </Animatable.Text>
          :
            <Icon style={style.heartbeatIcon} type="FontAwesome" name="heartbeat" />
          }
        </View>
        <FlatList style={style.connectorsContainer}
          data={items.connectors}
          renderItem={item => this._renderItem(item, items, nav, siteID)}
          keyExtractor={(connector, index) => connector.connectorId.toString()}
        />
      </View>
    );
  }
}

export default ChargerComponent;
