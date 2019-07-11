import variable from "./../variables/platform";
import { scale } from "react-native-size-matters";

export default (variables = variable) => {
  const badgeTheme = {
    ".primary": {
      backgroundColor: variables.btnPrimaryBg
    },
    ".warning": {
      backgroundColor: variables.btnWarningBg
    },
    ".info": {
      backgroundColor: variables.btnInfoBg
    },
    ".success": {
      backgroundColor: variables.btnSuccessBg
    },
    ".danger": {
      backgroundColor: variables.btnDangerBg
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
    // alignSelf: "flex-start",
    borderRadius: 13.5,
    height: scale(32)
  };
  return badgeTheme;
};
