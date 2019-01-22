import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Badge } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { Text, View, Icon } from "native-base";
import computeStyleSheet from "./styles";
import I18n from "../../I18n/I18n";

class SiteAreaComponent extends ResponsiveComponent {

  render() {
    const style = computeStyleSheet();
    const { siteArea, navigation } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Chargers", { siteAreaID: siteArea.id, allowBackButton: true })}>
        <View style={style.siteContainer}>
          <View style={style.mainContent}>
            <Text style={style.siteName}>{siteArea.name}</Text>
            <Icon style={style.icon} name="arrow-forward"/>
          </View>
          <View style={style.detailsContainer}>
            <Text style={style.connectorText}>{I18n.t("sites.chargePoint")}</Text>
            <View style={[style.badgeContainer, style.badgeSuccessContainer]}>
              <Badge containerStyle={[style.connectorBadge, style.freeConnectorBadge]}
                textStyle={style.connectorBadgeTitle} value={siteArea.availableConnectors}/>
              <Text style={style.connectorSubTitle}>{I18n.t("sites.free")}</Text>
            </View>
            <View style={[style.badgeContainer, style.badgeOccupiedContainer]}>
              <Badge containerStyle={[style.connectorBadge, style.occupiedConnectorBadge]}
                textStyle={style.connectorBadgeTitle} value={siteArea.totalConnectors - siteArea.availableConnectors}/>
              <Text style={style.connectorSubTitle}>{I18n.t("sites.occupied")}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SiteAreaComponent;
