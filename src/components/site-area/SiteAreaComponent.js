import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { TouchableOpacity } from "react-native";
import { Text, View, Icon } from "native-base";
import computeStyleSheet from "./SiteAreaComponentStyles";
import I18n from "../../I18n/I18n";
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import Constants from "../../utils/Constants";
import Message from "../../utils/Message";
import ConnectorStatusesContainerComponent from "../connector-status/ConnectorStatusesContainerComponent";

let counter = 0;

export default class SiteAreaComponent extends ResponsiveComponent {
  render() {
    const style = computeStyleSheet();
    const { siteArea, navigation } = this.props;
    return (
      <Animatable.View
        animation={counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}
      >
        <TouchableOpacity
          onPress={() => {
            if (siteArea.totalConnectors > 0) {
              // Navigate
              navigation.navigate("Chargers", {
                siteAreaID: siteArea.id,
              });
            } else {
              // No connector
              Message.showError(I18n.t("siteAreas.noChargers"));
            }
          }}
        >
          <View style={style.container}>
            <View style={style.headerContent}>
              <Text style={style.name}>{siteArea.name}</Text>
              <Icon
                style={siteArea.totalConnectors > 0 ? style.icon : style.iconHidden}
                type="MaterialIcons"
                name="navigate-next"
              />
            </View>
            <View style={style.connectorContent}>
              <ConnectorStatusesContainerComponent
                totalConnectors={siteArea.totalConnectors}
                availableConnectors={siteArea.availableConnectors}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

SiteAreaComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  siteArea: PropTypes.object.isRequired,
};

SiteAreaComponent.defaultProps = {};
