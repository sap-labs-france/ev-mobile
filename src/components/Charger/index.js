import React, { Component } from "react";
import { FlatList, SectionList, Dimensions } from "react-native";
import { Text, View, ListItem, Badge } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;
class ChargerComponent extends Component {

  _renderConnector = ({item, index}) => {
    let alpha = String.fromCharCode(65 + index);
    return (
      undefined
    );
  }

  _renderItem = ({item, index}) => {
    return (
      <ListItem>
          <View style={{backgroundColor: "#87CEEB", flex: 1}}>
            {/* Title */}
            <View style={{backgroundColor: "#DDA0DD", paddingBottom: 5}}>
              <Text>{item.id} - <Text style={{fontStyle: "italic"}}>{item.chargePointVendor}</Text></Text>
            </View>
          </View>
            {/* <FlatList style={{flexDirection: "row"}} data={item.connectors} renderItem={this._renderConnector} keyExtractor={(connector, index) => connector.connectorId.toString()} /> */}
      </ListItem>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <FlatList data={items} renderItem={this._renderItem} keyExtractor={(item, index) => item.id}/>
      </View>
    );
  }
}

export default ChargerComponent;
