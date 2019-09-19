import variable from "./../variables/platform";
import PLATFORM from "./../variables/commonColor/PLATFORM";
import Platform from "react-native/Platform";

export default (variables /* : * */ = variable) => {
  const subtitleTheme = {
    fontSize: variables.subTitleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.subtitleColor,
    textAlign: "center",
    paddingLeft: Platform.OS === PLATFORM.IOS ? 4 : 0,
    marginLeft: Platform.OS === PLATFORM.IOS ? undefined : -3
  };

  return subtitleTheme;
};
