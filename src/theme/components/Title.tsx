import variable from "./../variables/platform";
import PLATFORM from "./../variables/commonColor/PLATFORM";
import Platform from "react-native/Platform";

export default (variables /* : * */ = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === PLATFORM.IOS ? "700" : undefined,
    textAlign: "center",
    paddingLeft: Platform.OS === PLATFORM.IOS ? 4 : 0,
    marginLeft: Platform.OS === PLATFORM.IOS ? undefined : -3,
    paddingTop: 1
  };

  return titleTheme;
};
