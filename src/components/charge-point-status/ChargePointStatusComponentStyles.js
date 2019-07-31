import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet, scale, moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    width: "150@s",
    height: "65@s",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  connectorValue: {
    color: commonColor.badgeColor,
    fontSize: commonColor.fontSizeBase,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: Platform.OS === "ios" ? "-35@s" : "-37@s"
  },
  freeConnector: {
    backgroundColor: commonColor.brandSuccess,
    borderColor: commonColor.brandSuccessDark
  },
  freeConnectorValue: {},
  supendedConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryDark
  },
  suspendedConnectorValue: {},
  chargingConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderTopColor: commonColor.brandPrimary,
    borderBottomColor: commonColor.brandPrimary,
    borderLeftColor: commonColor.brandPrimaryLight,
    borderRightColor: commonColor.brandPrimaryLight
  },
  chargingConnectorValue: {},
  connectorSubTitle: {
    position: "absolute",
    bottom: 0,
    fontSize: "15@s",
    color: commonColor.textColorApp
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
