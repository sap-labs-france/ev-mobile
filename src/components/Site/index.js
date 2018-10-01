import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  Text,
  View,
  Icon
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";

import styles from "./styles";

class SiteComponent extends Component {

  render() {
    const { item, navigation } = this.props;
    return (
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => navigation.navigate("SiteAreas", { siteID: item.id })}
      >
        <View style={styles.newsContent}>
          <Grid>
            <Col>
              <Text style={styles.newsHeader}>
                {item.name}
              </Text>
            </Col>
            <Col>
              <Icon style={{alignSelf: "flex-end"}} active name="arrow-forward"/>
            </Col>
          </Grid>
          <Grid style={{ marginTop: 10 }}>
            <Col>
              <Text style={styles.newsLink}>{item.address.city}</Text>
            </Col>
            <Col>
              <TouchableOpacity style={styles.newsTypeView} onPress={() => navigation.navigate("Channel")}>
                <Text style={styles.newsTypeText}>{item.address.department}</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
