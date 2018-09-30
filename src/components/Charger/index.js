import React, { Component } from "react";
import { FlatList } from "react-native";
import {
  Text,
  View,
  ListItem
} from "native-base";

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
      <View style={{paddingBottom: 25}}>
          <FlatList data={items} renderItem={this._renderItem} keyExtractor={item => item.id}/>
      </View>
    );
  }
}

export default ChargerComponent;
