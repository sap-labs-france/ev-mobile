import React from "react";
import PropTypes from "prop-types";
import computeStyleSheet from "./ChargePointStatusStyles.js";
import { Badge, Text, View } from "native-base";

const style = computeStyleSheet();

export default function ChargePointStatus(props) {
  const isOccupied = props.type === "occupied";
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
        value={props.value}
        {...badgeType}
      >
        <Text style={style.connectorBadgeTitle}>{props.value}</Text>
      </Badge>
      <Text style={style.connectorSubTitle}>{props.text}</Text>
    </View>
  );
}

ChargePointStatus.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string
};
