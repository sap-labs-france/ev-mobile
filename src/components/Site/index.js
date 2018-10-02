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
        <View style={styles.content}>
          <Grid>
            <Col>
              <Text style={styles.siteName}>
                {item.name}
              </Text>
            </Col>
            <Col>
              <Icon style={styles.icon} active name="arrow-forward"/>
            </Col>
          </Grid>
          <Grid style={{ marginTop: 10 }}>
            <Col>
              <Text>Available chargers: <Text style={styles.numberChargers}>700</Text></Text>
            </Col>
            <Col>
              <TouchableOpacity>
                <Text style={styles.city} >{item.address.city}</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
