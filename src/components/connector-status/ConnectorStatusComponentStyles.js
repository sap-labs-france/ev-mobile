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
    fontSize: commonColor.fontSizeBase,
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
    color: commonColor.brandDanger,
    borderColor: commonColor.brandDanger
  },
  availableConnector: {
    color: commonColor.brandSuccess,
    borderColor: commonColor.brandSuccess
  },
  supendedConnector: {
    color: commonColor.brandPrimaryDark,
    borderColor: commonColor.brandPrimaryDark
  },
  preparingConnector: {
    color: commonColor.brandWarning,
    borderColor: commonColor.brandWarning
  },
  finishingConnector: {
    color: commonColor.brandWarning,
    borderColor: commonColor.brandWarning
  },
  unavailableConnector: {
    color: commonColor.brandDisable,
    borderColor: commonColor.brandDisable
  },
  reservedConnector: {
    color: commonColor.brandDisable,
    borderColor: commonColor.brandDisable
  },
  chargingConnector: {
    color: commonColor.brandPrimaryDark,
    borderColor: commonColor.brandInfo,
    borderTopColor: commonColor.brandPrimaryDark,
    borderBottomColor: commonColor.brandPrimaryDark
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
