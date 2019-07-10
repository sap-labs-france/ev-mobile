import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {},
  statusContainer: {
    width: "44@s",
    height: "44@s",
    borderRadius: "22@s",
    justifyContent: "center",
    alignItems: "center"
  },
  statusLetter: {
    color: commonColor.textColor,
    fontWeight: "bold",
    fontSize: "30@s",
    marginTop: "-2@s"
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
});

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
