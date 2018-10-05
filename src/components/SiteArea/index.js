import React, { Component } from "react";
import {
  Text,
  View,
  ListItem,
} from "native-base";

import styles from "./styles";

class  SiteAreaComponent extends Component {

  render() {
    const { item } = this.props;
    return (
      <ListItem style={{backgroundColor: "transparent", paddingBottom: 5}} itemDivider>
        <View>
          <Text style={styles.newsHeader}>
            {item.name}
          </Text>
        </View>
      </ListItem>
    );
  }
}

export default SiteAreaComponent;
