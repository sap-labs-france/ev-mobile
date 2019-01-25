import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  status: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22)
  },
  statusLetter: {
    color: commonColor.textColor,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: (Platform.OS === "ios" ? scale(32) : scale(32)),
    marginTop: (Platform.OS === "ios" ? scale(3) : scale(0)),
    marginLeft: (Platform.OS === "ios" ? scale(1) : undefined)
  },
  statusGreen: {
    backgroundColor: commonColor.brandSuccess,
  },
  statusRed: {
    backgroundColor: commonColor.brandDanger,
  },
  statusOrange: {
    backgroundColor: commonColor.brandWarning,
  }
};

const portraitStyles = {
};

const landscapeStyles = {
};

export default function computeStyleSheet() {
  return ResponsiveStyleSheet.select([
    {
      query: { orientation: "landscape" },
      style: deepmerge(commonStyles, landscapeStyles)
    },
    {
      query: { orientation: "portrait" },
      style: deepmerge(commonStyles, portraitStyles)
    }
  ]);
}
