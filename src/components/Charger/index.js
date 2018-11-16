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
    // Is last heartbeat has been received more than 5 minutes ago ?
    if ((minutesNow - getLastHeartbeatMinutes) > 5) {
      // Yes: Charger is dead
      this.setState({isChargerDead: true});
    } else {
      // No: It doesn't
      this.setState({isChargerDead: false});
    }
  }

  _renderItem = ({item, index}, charger, navigation, siteImage) => {
    let alpha = String.fromCharCode(65 + index);
    return (
      <ConnectorComponent alpha={alpha} index={index} item={item} nav={navigation} charger={charger} sitePicture={siteImage} />
    );
  }

  render() {
    const {  items, nav, sitePicture } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={styles.container}>
        <ListItem style={styles.listDividerContainer} itemDivider>
          <Text style={styles.chargerName}>{items.id} {/*| <Text style={styles.siteAreaName}>{items.siteArea.name}</Text>*/}</Text>
          { !isChargerDead ?
            <Animatable.Text animation="pulse" easing="ease-in" iterationCount="infinite">
              <Icon style={styles.heartbeatIcon} type="FontAwesome" name="heartbeat" />
            </Animatable.Text>
          :
            <Icon style={styles.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
          }
        </ListItem>
        <FlatList style={styles.listContainer}
          data={items.connectors}
          renderItem={item => this._renderItem(item, items, nav, sitePicture)}
          keyExtractor={(connector, index) => connector.connectorId.toString()}
        />
      </View>
    );
  }
}

export default ChargerComponent;
