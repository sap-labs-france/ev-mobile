import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { TouchableOpacity } from "react-native";
import { Text, View, Icon, Badge } from "native-base";
import openMap from "react-native-open-maps";
import computeStyleSheet from "./styles";

import I18n from "../../I18n/I18n";

class SiteComponent extends ResponsiveComponent {

  _siteLocation(address) {
    openMap({ latitude: address.latitude, longitude: address.longitude, zoom: 18});
  }

  get style() {
    return computeStyleSheet();
  }

  render() {
    const { style } = this;
    const { site, navigation } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Chargers", { site: site })}>
        <View style={style.siteContainer}>
          <View style={style.mainContent}>
            <Text style={style.siteName}>{site.name}</Text>
            <TouchableOpacity onPress={()=>this._siteLocation(site.address)}>
              <Icon style={style.icon} name="pin" />
            </TouchableOpacity>
            <Icon style={style.icon} name="arrow-forward"/>
          </View>
          <View style={style.detailsContent}>
            <Text style={style.chargerText}>{I18n.t("sites.freeChargers")}</Text>
            <Badge success style={style.badge}>
              <Text style={style.badgeText}>{site.availableChargers}</Text>
            </Badge>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
