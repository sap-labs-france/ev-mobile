import * as Animatable from "react-native-animatable";
import Icon from "native-base/Icon";
import Text from "native-base/Text";
import View from "native-base/View";
import PropTypes from "prop-types";
import React from "react";
import openMap from "react-native-open-maps";
import ResponsiveComponent from "react-native-responsive-ui/ResponsiveComponent";
import TouchableOpacity from "react-native/TouchableOpacity";
import Constants from "../../utils/Constants";
import ConnectorStatusesContainerComponent from "../connector-status/ConnectorStatusesContainerComponent";
import computeStyleSheet from "./SiteComponentStyles";

let counter = 0;
export default class SiteComponent extends ResponsiveComponent {
  _siteLocation(address) {
    openMap({
      latitude: address.latitude,
      longitude: address.longitude,
      zoom: 18
    });
  }

  render() {
    const style = computeStyleSheet();
    const { site, navigation } = this.props;
    let connectorStats;
    // New backend?
    if (site.connectorStats) {
      // Override
      connectorStats = site.connectorStats;
    } else {
      connectorStats = {
        totalConnectors: site.totalConnectors,
        availableConnectors: site.availableConnectors
      };
    }
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity onPress={() => navigation.navigate("SiteAreas", { siteID: site.id })}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <View style={style.subHeaderContent}>
                <TouchableOpacity onPress={() => this._siteLocation(site.address)}>
                  <Icon style={style.icon} name="pin" />
                </TouchableOpacity>
                <Text style={style.headerName}>{site.name}</Text>
              </View>
              <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />
            </View>
            <View style={style.connectorContent}>
              <ConnectorStatusesContainerComponent connectorStats={connectorStats} />
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

SiteComponent.defaultProps = {};
