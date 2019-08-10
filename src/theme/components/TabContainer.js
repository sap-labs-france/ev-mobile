// @flow

import { Platform } from "react-native";
import variable from "./../variables/platform";
import { PLATFORM } from "./../variables/commonColor";
import { scale } from "react-native-size-matters";

export default (variables /* : * */ = variable) => {
  const platformStyle = variables.platformStyle;

  const tabContainerTheme = {
    height: scale(50),
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: Platform.OS === PLATFORM.IOS ? variables.borderWidth : 0,
    borderColor: variables.topTabBarBorderColor
  };

  return tabContainerTheme;
};
