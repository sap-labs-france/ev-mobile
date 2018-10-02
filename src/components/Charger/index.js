import React, { Component } from "react";
import { FlatList } from "react-native";
import {
  Text,
  View,
  ListItem
} from "native-base";
import styles from "./styles";

class ChargerComponent extends Component {

  _renderItem({item}) {
    return (
      <ListItem>
        <Text>{item.id}</Text>
      </ListItem>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
          <FlatList data={items} renderItem={this._renderItem} keyExtractor={item => item.id}/>
      </View>
    );
  }
}

export default ChargerComponent;
