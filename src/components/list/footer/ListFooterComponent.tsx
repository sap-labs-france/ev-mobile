import { Spinner, View } from "native-base";
import PropTypes from "prop-types";
import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./ListFooterComponentStyles";

export default class ListFooterComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const style = computeStyleSheet();
    const { skip, limit, count } = this.props;
    if (skip + limit < count || count === -1) {
      return (
        <View style={style.spinnerContainer}>
          <Spinner />
        </View>
      );
    }
    return null;
  }
}

ListFooterComponent.propTypes = {
  skip: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number
};

ListFooterComponent.defaultProps = {};
