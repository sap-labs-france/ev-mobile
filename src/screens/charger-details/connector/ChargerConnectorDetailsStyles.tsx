import deepmerge from "deepmerge";
import { Platform } from "react-native";
import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import { ScaledSheet } from "react-native-size-matters";
import commonColor from "../../../theme/variables/commonColor";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: commonColor.containerBgColor
  },
  spinner: {
    color: commonColor.textColor
  },
  backgroundImage: {
    width: "100%",
    height: "125@s"
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-100@s",
    backgroundColor: "transparent"
  },
  buttonTransaction: {
    borderRadius: "50@s",
    borderStyle: "solid",
    borderWidth: "4@s",
    marginTop: "15@s",
    borderColor: commonColor.textColor,
    backgroundColor: commonColor.containerBgColor,
    width: "100@s",
    height: "100@s",
    justifyContent: "center",
    alignItems: "center"
  },
  noButtonStopTransaction: {
    height: "130@s"
  },
  startTransaction: {
    borderColor: commonColor.brandSuccess
  },
  stopTransaction: {
    borderColor: commonColor.brandDanger
  },
  transactionIcon: {
    fontSize: "75@s"
  },
  startTransactionIcon: {
    color: commonColor.brandSuccess
  },
  stopTransactionIcon: {
    color: commonColor.brandDanger
  },
  buttonTransactionDisabled: {
    borderColor: commonColor.buttonDisabledBg
  },
  transactionDisabledIcon: {
    color: commonColor.buttonDisabledBg,
    backgroundColor: "transparent"
  },
  scrollViewContainer: {},
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "95@s"
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%"
  },
  connectorLetter: {
    marginTop: "5@s",
    marginBottom: "5@s"
  },
  label: {
    fontSize: "16@s",
    color: commonColor.brandPrimaryDark,
    alignSelf: "center"
  },
  labelValue: {
    fontSize: "25@s",
    fontWeight: "bold"
  },
  labelUser: {
    fontSize: "10@s"
  },
  subLabel: {
    fontSize: "10@s",
    marginTop: Platform.OS === "ios" ? "0@s" : "-5@s",
    color: commonColor.brandPrimaryDark,
    alignSelf: "center"
  },
  subLabelStatusError: {
    color: commonColor.brandDanger,
    marginTop: "2@s"
  },
  subLabelUser: {
    fontSize: "8@s",
    marginTop: "0@s"
  },
  icon: {
    fontSize: "25@s"
  },
  userImage: {
    height: "52@s",
    width: "52@s",
    alignSelf: "center",
    marginBottom: "5@s",
    borderRadius: "26@s",
    borderWidth: "3@s",
    borderColor: commonColor.textColor
  },
  info: {
    color: commonColor.brandPrimaryDark,
    borderColor: commonColor.brandPrimaryDark
  },
  success: {
    color: commonColor.brandSuccess
  },
  warning: {
    color: commonColor.brandWarning
  },
  danger: {
    color: commonColor.brandDanger
  },
  disabled: {
    color: commonColor.buttonDisabledBg,
    borderColor: commonColor.buttonDisabledBg
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
