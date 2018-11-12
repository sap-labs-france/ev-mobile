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
      isChargerDead: true,
      timeNow: new Date()
    };
  }

  isChargerDead = (lastHeartbeat) => {
    if (!lastHeartbeat) {
      this.setState({isChargerDead: true});
    }
      let minutesNow = this.state.timeNow.getMinutes();
      let lastHeartbeatMinutes = new Date(lastHeartbeat).getMinutes();
      let elipsedMinute = minutesNow - lastHeartbeatMinutes;
      if (elipsedMinute > 5) {
        this.setState({isChargerDead: false});
      }
  };

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
