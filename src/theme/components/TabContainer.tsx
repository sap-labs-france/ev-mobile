import variable from "./../variables/platform";
import PLATFORM from "./../variables/commonColor/PLATFORM";
import scale from "react-native-size-matters/scale";
import Platform from "react-native/Platform";

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
