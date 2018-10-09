import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  Text,
  View,
  Icon,
  Badge
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import openMap from "react-native-open-maps";

import styles from "./styles";

class SiteComponent extends Component {

  _siteLocation(address) {
    openMap({ latitude: address.latitude, longitude: address.longitude, zoom: 18});
  }

  render() {
    const { item, navigation } = this.props;
    return (
      <TouchableOpacity
        style={styles.buttonItem}
        onPress={() => navigation.navigate("Chargers", { siteID: item.id })}
      >
        <View style={styles.content}>
          <Grid>
            <Col style={styles.siteNameColumn}>
              <Text style={styles.siteName}>{item.name}</Text>
            </Col>
            <Col style={styles.pinIconColumn}>
              <TouchableOpacity>
                <Icon style={styles.pinIcon} onPress={()=>this._siteLocation(item.address)} name="pin" />
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
                <Text>{item.availableChargers}</Text>
              </Badge>
            </Col>
          </Grid>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
