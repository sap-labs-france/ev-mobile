import React, { Component } from "react";
import { FlatList, SectionList, Dimensions } from "react-native";
import { Text, View, ListItem, Badge } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;
class ChargerComponent extends Component {

  _renderItem = ({item, index}) => {
    return (
      undefined
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <ListItem style={{backgroundColor: "transparent", paddingBottom: 5, justifyContent: "space-between"}} itemDivider>
            <Text>{items.id}</Text>
            <Text>{/*items.siteArea.name*/}Site Area</Text>
        </ListItem>
        <ListItem style={{justifyContent: "center", alignItems: "center"}}>
          <Text>Charger Connectors Page</Text>
        </ListItem>
      </View>
    );
  }
}

export default ChargerComponent;
