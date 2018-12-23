import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Badge } from 'react-native-elements'
import { TouchableOpacity, PixelRatio } from "react-native";
import { Text, View, Icon } from "native-base";
import openMap from "react-native-open-maps";
import computeStyleSheet from "./styles";

import I18n from "../../I18n/I18n";

console.log(PixelRatio.getFontScale());


class SiteComponent extends ResponsiveComponent {

  _siteLocation(address) {
    openMap({ latitude: address.latitude, longitude: address.longitude, zoom: 18});
  }

  render() {
    const style = computeStyleSheet();
    const { site, navigation } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Chargers", { site: site })}>
        <View style={style.siteContainer}>
          <View style={style.mainContent}>
            <TouchableOpacity onPress={()=>this._siteLocation(site.address)}>
              <Icon style={style.icon} name="pin" />
            </TouchableOpacity>
            <Text style={style.siteName}>{site.name}</Text>
            <Icon style={style.icon} name="arrow-forward"/>
          </View>
          <View style={style.detailsContent}>
            <Text style={style.chargerText}>{I18n.t("sites.freeChargers")}</Text>
            <Badge containerStyle={style.badge} textStyle={style.badgeText} value={site.availableChargers}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteComponent;
