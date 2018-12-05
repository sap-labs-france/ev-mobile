import React, { Component } from "react";
import { TouchableOpacity, Text as TextRN } from "react-native";
import { Text, View, Icon, Badge } from "native-base";
import openMap from "react-native-open-maps";

import I18n from "../../I18n/I18n";
import styles from "./styles";

class SiteComponent extends Component {

  _siteLocation(address) {
    openMap({ latitude: address.latitude, longitude: address.longitude, zoom: 18});
  }

  render() {
    const { item, navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Chargers", { siteID: item.id })}
      >
        <View style={styles.siteContainer}>
          <View style={styles.mainContent}>
            <View style={styles.columnSiteName}>
              <Text style={styles.siteName}>{item.name}</Text>
            </View>
            <View style={styles.columnPinIcon}>
              <TouchableOpacity onPress={()=>this._siteLocation(item.address)}>
                <Icon style={styles.pinIcon} name="pin" />
              </TouchableOpacity>
            </View>
            <View style={styles.columnArrowIcon}>
              <Icon name="arrow-forward"/>
            </View>
          </View>
          <View style={styles.detailsContent}>
            <View style={styles.columnFreeChargers}>
              <Text style={styles.freeChargersText}>{I18n.t("sites.freeChargers")}</Text>
            </View>
            <View style={styles.columnNumberChargers}>
              <Badge success style={styles.badge}>
                <Text style={styles.badgeText}>{item.availableChargers}</Text>
              </Badge>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
