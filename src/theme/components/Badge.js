// @flow

import variable from "./../variables/platform";
import { PLATFORM } from "./../variables/commonColor";
import { scale } from "react-native-size-matters";

export default (variables /* : * */ = variable) => {
  const badgeTheme = {
    ".primary": {
      backgroundColor: variables.buttonPrimaryBg
    },
    ".warning": {
      backgroundColor: variables.buttonWarningBg
    },
    ".info": {
      backgroundColor: variables.buttonInfoBg
    },
    ".success": {
      backgroundColor: variables.buttonSuccessBg
    },
    ".danger": {
      backgroundColor: variables.buttonDangerBg
    },
    "NativeBase.Text": {
      color: variables.badgeColor,
      fontSize: variables.fontSizeBase,
      lineHeight: variables.lineHeight - 3,
      textAlign: "center",
      paddingHorizontal: 3
    },
    backgroundColor: variables.badgeBg,
    padding: variables.badgePadding,
    paddingHorizontal: 6,
    justifyContent: variables.platform === PLATFORM.IOS ? "center" : undefined,
    borderRadius: 13.5,
    height: scale(32)
  };
  return badgeTheme;
};
