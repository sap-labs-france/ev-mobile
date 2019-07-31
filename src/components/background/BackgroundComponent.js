import React from "react";
import { ImageBackground } from "react-native";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./BackgroundComponentStyles";
import PropTypes from "prop-types";

// const background = require("../../../assets/bg.png");
const background = require("../../../assets/sidebar-transparent.png");

export default class BackgroundComponent extends ResponsiveComponent {
  render() {
    const style = computeStyleSheet();
    return (
      <ImageBackground
        source={background}
        style={style.background}
        imageStyle={style.imageBackground}
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}
