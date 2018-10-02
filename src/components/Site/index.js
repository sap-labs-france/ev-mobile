import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  Text,
  View,
  Icon,
  Badge
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
            <Col style={styles.siteNameColumn}>
              <Text style={styles.siteName}>{item.name}</Text>
            </Col>
            <Col style={styles.pinIconColumn}>
              <TouchableOpacity>
                <Icon style={styles.pinIcon} name="pin" />
              </TouchableOpacity>
            </Col>
            <Col>
              <Icon style={styles.arrowIcon} active name="arrow-forward"/>
            </Col>
          </Grid>
          <Grid style={styles.detailsGrid}>
            <Col style={styles.freeChargersColumn}>
              <Text style={styles.freeChargersText}>Free chargers:</Text>
            </Col>
            <Col>
              <Badge success style={styles.badge}>
                <Text>9000</Text>
              </Badge>
            </Col>
          </Grid>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
