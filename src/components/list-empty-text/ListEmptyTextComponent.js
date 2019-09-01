import React from "react";
import { Text } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ListEmptyTextComponentStyles";
import I18n from "../../I18n/I18n";
import PropTypes from "prop-types";

export default class ListEmptyTextComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const style = computeStyleSheet();
    const { text } = this.props;
    return (<Text style={style.noRecordFound}>{text ? text : I18n.t("general.noRecordFound")}</Text>);
  }
}

ListEmptyTextComponent.propTypes = {
  text: PropTypes.string

};

ListEmptyTextComponent.defaultProps = {
};
