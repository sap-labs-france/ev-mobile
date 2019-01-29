import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Badge } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { Text, View, Icon } from "native-base";
import openMap from "react-native-open-maps";
import computeStyleSheet from "./styles";
import I18n from "../../I18n/I18n";
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import Constants from "../../utils/Constants";

let counter = 0;
export default class SiteComponent extends ResponsiveComponent {

  _siteLocation(address) {
    openMap({ latitude: address.latitude, longitude: address.longitude, zoom: 18});
  }

  render() {
    const style = computeStyleSheet();
    const { site, navigation } = this.props;
    return (
      <Animatable.View animation={(counter++ % 2 === 0) ? "fadeInLeft" : "fadeInRight"} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity onPress={() => navigation.navigate("SiteAreas", { siteID: site.id })}>
          <View style={style.container}>
            <View style={style.mainContent}>
              <TouchableOpacity onPress={()=>this._siteLocation(site.address)}>
                <Icon style={style.icon} name="pin" />
              </TouchableOpacity>
              <Text style={style.name}>{site.name}</Text>
              <Icon style={style.icon} name="arrow-forward"/>
            </View>
            <View style={style.detailedContent}>
              <Text style={style.connectorText}>{I18n.t("sites.chargePoint")}</Text>
              <View style={[style.badgeContainer, style.badgeSuccessContainer]}>
                <Badge containerStyle={[style.connectorBadge, style.freeConnectorBadge]} textStyle={style.connectorBadgeTitle} value={site.availableConnectors}/>
                <Text style={style.connectorSubTitle}>{I18n.t("sites.free")}</Text>
              </View>
              <View style={[style.badgeContainer, style.badgeOccupiedContainer]}>
                <Badge containerStyle={[style.connectorBadge, style.occupiedConnectorBadge]} textStyle={style.connectorBadgeTitle} value={site.totalConnectors - site.availableConnectors}/>
                <Text style={style.connectorSubTitle}>{I18n.t("sites.occupied")}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

SiteComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  site: PropTypes.object.isRequired
};

SiteComponent.defaultProps = {
};
