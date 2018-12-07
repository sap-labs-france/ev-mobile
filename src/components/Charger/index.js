import React, { Component } from "react";
import { FlatList } from "react-native";
import { Text, View, ListItem, Icon } from "native-base";

import * as Animatable from "react-native-animatable";

import ConnectorComponent from "../Connector";
import styles from "./styles";

class ChargerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isChargerDead: false,
      minutesNow: new Date().getMinutes()
    };
  }

  componentDidMount() {
    const { items } = this.props;
    const { minutesNow } = this.state;
    // Check if charger is dead
    this.isHeartbeat(items, minutesNow);

  }

  isHeartbeat = (charger, minutesNow) => {
    let getLastHeartbeatMinutes = new Date(charger.lastHeartBeat).getMinutes();
    // Is last heartbeat has been sent more than 5 minutes ago ?
    if ((minutesNow - getLastHeartbeatMinutes) > 5) {
      // Yes: Charger is dead
      this.setState({isChargerDead: true});
    } else {
      // No: It doesn't
      this.setState({isChargerDead: false});
    }
  }

  _renderItem = ({item, index}, charger, navigation, siteID) => {
    return (
      <ConnectorComponent index={index} item={item} nav={navigation} charger={charger} siteID={siteID} />
    );
  }

  render() {
    const {  items, nav, siteID } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={styles.container}>
        <ListItem style={styles.listDividerContainer} itemDivider>
          <Text style={styles.chargerName}>{items.id}</Text>
          { !isChargerDead ?
            <Icon style={styles.heartbeatIcon} type="FontAwesome" name="heartbeat" />
          :
            <Animatable.Text animation="pulse" easing="ease-in" iterationCount="infinite">
              <Icon style={styles.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
            </Animatable.Text>
          }
        </ListItem>
        <FlatList style={styles.listContainer}
          data={items.connectors}
          renderItem={item => this._renderItem(item, items, nav, siteID)}
          keyExtractor={(connector, index) => connector.connectorId.toString()}
        />
      </View>
    );
  }
}

export default ChargerComponent;
