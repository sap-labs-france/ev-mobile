import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { Platform } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

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
    height: "150@s"
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-55@s"
  },
  buttonTransaction: {
    borderRadius: "50@s",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    backgroundColor: commonColor.containerBgColor,
    width: "100@s",
    height: "100@s",
    justifyContent: "center",
    alignItems: "center"
  },
  noButtonStopTransaction: {
    height: "90@s"
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
    color: commonColor.buttonDisabledBg
  },
  scrollViewContainer: {
    marginTop: "-15@s"
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "100@s"
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
    color: commonColor.textColor,
    alignSelf: "center"
  },
  labelStatus: {
    fontSize: "16@s"
  },
  labelValue: {
    fontSize: "30@s",
    fontWeight: "bold"
  },
  labelTimeValue: {
    fontSize: "25@s",
    fontWeight: "bold"
  },
  labelUser: {
    fontSize: "16@s"
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
    borderWidth: 2,
    borderColor: commonColor.textColor
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
