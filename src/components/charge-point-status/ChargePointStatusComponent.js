import React from "react";
import PropTypes from "prop-types";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ChargePointStatusComponentStyles.js";
import { Badge, Text, View } from "native-base";
import I18n from "../../I18n/I18n";

const style = computeStyleSheet();

export default class ChargePointStatusComponent extends ResponsiveComponent {
  render() {
    const isOccupied = this.props.type === "occupied";
    const viewStyle = [style.badgeContainer].concat(
      isOccupied ? style.badgeOccupiedContainer : style.badgeSuccessContainer
    );
    const badgeStyle = [style.connectorBadge].concat(
      isOccupied ? style.occupiedConnectorBadge : style.freeConnectorBadge
    );
    const badgeType = isOccupied ? { danger: true } : { success: true };

    return (
      <View style={viewStyle}>
        <Badge
          containerStyle={badgeStyle}
          textStyle={style.connectorBadgeTitle}
          value={this.props.value}
          {...badgeType}
        >
          <Text style={style.connectorBadgeTitle}>{this.props.value}</Text>
        </Badge>
        <Text style={style.connectorSubTitle}>{this.props.text}</Text>
      </View>
    );
  }
}

ChargePointStatusComponent.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string
};
