import * as Animatable from "react-native-animatable";
import Icon from "native-base/Icon";
import Text from "native-base/Text";
import View from "native-base/View";
import PropTypes from "prop-types";
import React from "react";
import ResponsiveComponent from "react-native-responsive-ui/ResponsiveComponent";
import TouchableOpacity from "react-native/TouchableOpacity";
import Constants from "../../utils/Constants";
import Message from "../../utils/Message";
import ConnectorStatusesContainerComponent from "../connector-status/ConnectorStatusesContainerComponent";
import computeStyleSheet from "./SiteAreaComponentStyles";

import I18n from "../../I18n/I18n";
let counter = 0;

export default class SiteAreaComponent extends ResponsiveComponent {
  render() {
    const style = computeStyleSheet();
    const { siteArea, navigation } = this.props;
    let connectorStats;
    // New backend?
    if (siteArea.connectorStats) {
      // Override
      connectorStats = siteArea.connectorStats;
    } else {
      connectorStats = {
        totalConnectors: siteArea.totalConnectors,
        availableConnectors: siteArea.availableConnectors
      };
    }
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            if (siteArea.totalConnectors > 0) {
              navigation.navigate("Chargers", {
                siteAreaID: siteArea.id
              });
            } else {
              Message.showError(I18n.t("siteAreas.noChargers"));
            }
          }}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <Text style={style.headerName}>{siteArea.name}</Text>
              <Icon style={siteArea.totalConnectors > 0 ? style.icon : style.iconHidden} type="MaterialIcons" name="navigate-next" />
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

SiteAreaComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  siteArea: PropTypes.object.isRequired
};

SiteAreaComponent.defaultProps = {};
