import variable from "./../variables/platform";
import { scale } from 'react-native-size-matters';

export default (variables = variable) => {
  const platform = variables.platform;

  const toastTheme = {
    ".danger": {
      backgroundColor: variables.brandDanger
    },
    ".warning": {
      backgroundColor: variables.brandWarning
    },
    ".success": {
      backgroundColor: variables.brandSuccess
    },
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: platform === "ios" ? 5 : 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(5),
    minHeight: scale(20),
    "NativeBase.Text": {
      color: variables.brandDanger,
      flex: 1
    },
    "NativeBase.Button": {
      backgroundColor: "transparent",
      marginTop: scale(5),
      height: scale(30),
      verticalAlign: "center",
      elevation: 0,
      "NativeBase.Text": {
        paddingTop: scale(5),
        height: scale(15),
        fontSize: scale(12)
      }
    }
  };

  return toastTheme;
};
