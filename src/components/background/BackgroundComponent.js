import React from "react";
import { ImageBackground } from "react-native";
import { View } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./BackgroundComponentStyles";
import PropTypes from "prop-types";

const defaultBackground = require("../../../assets/bg.png");
// const background = require("../../../assets/sidebar-transparent.png");

export default class BackgroundComponent extends ResponsiveComponent {
  render() {
    const style = computeStyleSheet();
    const { active, background } = this.props;
    return (
      active ?
        <ImageBackground
          source={(background ? background : defaultBackground)}
          style={style.background}
          imageStyle={style.imageBackground}
        >
          {this.props.children}
        </ImageBackground>
      :
        <View style={style.background}>
          {this.props.children}
        </View>
    );
  }
}

BackgroundComponent.propTypes = {
  active: PropTypes.object,
  background: PropTypes.object
};

BackgroundComponent.defaultProps = {
  active: true
};
