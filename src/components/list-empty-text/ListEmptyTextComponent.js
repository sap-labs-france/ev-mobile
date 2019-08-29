import React from "react";
import { Text } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ListEmptyTextComponentStyles";
import I18n from "../../I18n/I18n";

export default class ListEmptyTextComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const style = computeStyleSheet();
    return (<Text style={style.noRecordFound}>{I18n.t("general.noRecordFound")}</Text>);
  }
}

ListEmptyTextComponent.propTypes = {
};

ListEmptyTextComponent.defaultProps = {
};
