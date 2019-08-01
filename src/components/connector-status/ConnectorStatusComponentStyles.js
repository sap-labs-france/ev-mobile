import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet, scale, moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = ScaledSheet.create({
  containerWithText: {
    height: "60@s",
    width: "75@s",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  containerWithNoText: {
    height: "55@s",
    width: "60@s",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  connectorValue: {
    color: commonColor.badgeColor,
    fontSize: commonColor.fontSizeBase,
    fontWeight: "bold",
    textAlign: "center"
  },
  faultedConnector: {
    backgroundColor: commonColor.brandDanger,
    borderColor: commonColor.brandDangerDark
  },
  availableConnector: {
    backgroundColor: commonColor.brandSuccess,
    borderColor: commonColor.brandSuccessDark
  },
  supendedConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryDark
  },
  preparingConnector: {
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  finishingConnector: {
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  unavailableConnector: {
    backgroundColor: commonColor.brandDisable,
    borderColor: commonColor.brandDisableDark
  },
  reservedConnector: {
    backgroundColor: commonColor.brandDisable,
    borderColor: commonColor.brandDisableDark
  },
  chargingConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryLight,
    borderTopColor: commonColor.brandPrimary,
    borderBottomColor: commonColor.brandPrimary
  },
  connectorText: {
    position: "absolute",
    bottom: "-2@s",
    fontSize: "13@s",
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
