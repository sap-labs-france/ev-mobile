import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet, scale, moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = ScaledSheet.create({
  containerWithText: {
    height: "60@s",
    width: "85@s",
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
    fontSize: "20@s",
    fontWeight: "bold",
    textAlign: "center"
  },
  connectorDescription: {
    position: "absolute",
    bottom: "-2@s",
    fontSize: "12@s"
  },
  commonConnector: {
    backgroundColor: "transparent"
  },
  faultedConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandDanger,
    borderColor: commonColor.brandDangerDark
  },
  faultedConnectorText: {
    color: commonColor.brandDangerDark
  },
  availableConnector: {
    color: commonColor.brandSuccess,
    borderColor: commonColor.brandSuccess
  },
  availableConnectorText: {
    color: commonColor.brandSuccess
  },
  supendedConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryDark
  },
  supendedConnectorText: {
    color: commonColor.brandPrimaryDark
  },
  preparingConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  preparingConnectorText: {
    color: commonColor.brandWarning
  },
  finishingConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  finishingConnectorText: {
    color: commonColor.brandWarning
  },
  unavailableConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandDisable,
    borderColor: commonColor.brandDisableDark
  },
  unavailableConnectorText: {
    color: commonColor.brandDisable
  },
  reservedConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandDisable,
    borderColor: commonColor.brandDisableDark
  },
  reservedConnectorText: {
    color: commonColor.brandDisable
  },
  chargingConnector: {
    color: commonColor.inverseTextColor,
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryLight,
    borderTopColor: commonColor.brandPrimary,
    borderBottomColor: commonColor.brandPrimary
  },
  chargingConnectorText: {
    color: commonColor.brandPrimary
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
