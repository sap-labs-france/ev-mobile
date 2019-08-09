import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet, scale, moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = ScaledSheet.create({
  containerWithDescription: {
    height: "60@s",
    width: "100@s",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  containerWithNoDescription: {
    height: "55@s",
    width: "60@s",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  commonConnector: {
    backgroundColor: "transparent"
  },
  commonConnectorValue: {
    fontSize: "22@s",
    fontWeight: "bold",
    color: commonColor.inverseTextColor
  },
  commonConnectorDescription: {
    position: "absolute",
    bottom: "-2@s",
    fontSize: "12@s",
    color: commonColor.textColor
  },
  faultedConnector: {
    backgroundColor: commonColor.brandDanger,
    borderColor: commonColor.brandDangerDark
  },
  faultedConnectorValue: {},
  faultedConnectorDescription: {
    color: commonColor.brandDanger
  },
  availableConnector: {
    borderColor: commonColor.brandSuccess
  },
  availableConnectorValue: {
    color: commonColor.brandSuccess
  },
  availableConnectorDescription: {
    color: commonColor.brandSuccess
  },
  supendedConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryDark
  },
  supendedConnectorValue: {},
  supendedConnectorDescription: {
    color: commonColor.brandPrimaryDark
  },
  preparingConnector: {
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  preparingConnectorValue: {},
  preparingConnectorDescription: {
    color: commonColor.brandWarning
  },
  finishingConnector: {
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  finishingConnectorValue: {},
  finishingConnectorDescription: {
    color: commonColor.brandWarning
  },
  unavailableConnector: {
    backgroundColor: commonColor.brandDisable,
    borderColor: commonColor.brandDisableDark
  },
  unavailableConnectorValue: {},
  unavailableConnectorDescription: {
    color: commonColor.brandDisable
  },
  reservedConnector: {
    backgroundColor: commonColor.brandDisable,
    borderColor: commonColor.brandDisableDark
  },
  reservedConnectorValue: {},
  reservedConnectorDescription: {
    color: commonColor.brandDisable
  },
  chargingConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandInfoLight,
    borderTopColor: commonColor.brandPrimary,
    borderBottomColor: commonColor.brandPrimary
  },
  chargingConnectorValue: {},
  chargingConnectorDescription: {
    color: commonColor.brandPrimaryDark
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
