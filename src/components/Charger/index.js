import React, { Component } from "react";
import { FlatList } from "react-native";
import { Text, View, ListItem, Icon } from "native-base";

import * as Animatable from "react-native-animatable";
import ConnectorComponent from "../Connector";
import styles from "./styles";

class ChargerComponent extends Component {

  _renderItem = ({item, index}, navigation, items) => {
    let alpha = String.fromCharCode(65 + index);
    return (
      <ConnectorComponent alpha={alpha} index={index} item={item} nav={navigation} charger={items} />
    );
  }

  render() {
    const { items, nav } = this.props;
    return (
      <View style={styles.container}>
        <ListItem style={styles.listDividerContainer} itemDivider>
          <Text style={styles.chargerName}>{items.id} | <Text style={styles.siteAreaName}>{items.siteArea.name}</Text></Text>
          <Animatable.Text animation="pulse" easing="ease-in" iterationCount="infinite">
            <Icon style={styles.heartbeatIcon} type="FontAwesome" name="heartbeat" />
          </Animatable.Text>
        </ListItem>
        <FlatList style={styles.listContainer}
          data={items.connectors}
          renderItem={item => this._renderItem(item, nav, items)}
          keyExtractor={(connector, index) => connector.connectorId.toString()}
        />
      </View>
    );
  }
}

export default ChargerComponent;
