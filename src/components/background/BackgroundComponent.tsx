import { View } from "native-base";
import PropTypes from "prop-types";
import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { ImageBackground } from "react-native";
import computeStyleSheet from "./BackgroundComponentStyles";

// const defaultBackground = require("../../../assets/bg.png");
const defaultBackground = require("../../../assets/sidebar-transparent.png");

export default class BackgroundComponent extends ResponsiveComponent {
  render() {
    const style = computeStyleSheet();
    const { active, background } = this.props;
    return active ? (
      <ImageBackground
        source={background || defaultBackground}
        style={[style.background, this.props.style]}
        imageStyle={style.imageBackground}>
        {this.props.children}
      </ImageBackground>
    ) : (
      <View style={style.background}>{this.props.children}</View>
    );
  }
}

BackgroundComponent.propTypes = {
  active: PropTypes.bool,
  background: PropTypes.object,
  style: PropTypes.object
};

BackgroundComponent.defaultProps = {
  active: true,
  style: {}
};
