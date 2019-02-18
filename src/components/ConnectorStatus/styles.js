import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  container: {},
  statusContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: "center",
    alignItems: "center"
  },
  statusLetter: {
    color: commonColor.textColor,
    fontWeight: "bold",
    fontSize: scale(30),
    marginTop: scale(-2)
  },
  statusGreen: {
    backgroundColor: commonColor.brandSuccess
  },
  statusRed: {
    backgroundColor: commonColor.brandDanger
  },
  statusOrange: {
    backgroundColor: commonColor.brandWarning
  }
};

const portraitStyles = {};

const landscapeStyles = {};

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
