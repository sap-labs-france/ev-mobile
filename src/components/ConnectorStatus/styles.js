import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  statusLetter: {
    color: commonColor.textColor,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: (Platform.OS === "ios" ? scale(35) : scale(30))
  },
  statusGreen: {
    backgroundColor: commonColor.brandSuccess,
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21)
  },
  statusRed: {
    backgroundColor: commonColor.brandDanger,
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21)
  },
  statusOrange: {
    backgroundColor: commonColor.brandWarning,
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21)
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
