import React, { Component } from "react";
import { Platform, ProgressViewIOS, ProgressBarAndroid } from "react-native";
import color from "color";
import commonColor from "../../theme/variables/commonColor";

class ProgressBarNB extends Component {
  render() {
    if (Platform.OS === "ios") {
      return (
        <ProgressViewIOS
          {...this.props}
          progress={this.props.progress ? this.props.progress / 100 : 0.5}
          progressTintColor={this.props.color ? this.props.color : commonColor.textColor}
          trackTintColor={color(this.props.color).lighten(1).hex()}
        />
      );
    } else {
      return (
        <ProgressBarAndroid
          {...this.props}
          styleAttr="Horizontal"
          indeterminate={false}
          progress={this.props.progress ? this.props.progress / 100 : 0.5}
          color={this.props.color ? this.props.color : commonColor.textColor}
        />
      );
    }
  }
}

export default ProgressBarNB;
