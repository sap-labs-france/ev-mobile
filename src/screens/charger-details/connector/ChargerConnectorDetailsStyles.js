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
    backgroundColor: commonColor.brandPrimary
  },
  spinner: {
    color: commonColor.textColorApp
  },
  backgroundImage: {
    width: "100%",
    height: "150@s"
  },
  background: {
    flex: 1
  },
  imageBackground: {
    resizeMode: "cover"
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-55@s"
  },
  buttonTransaction: {
    borderRadius: "50@s",
    borderStyle: "solid",
    backgroundColor: commonColor.brandSuccess,
    borderWidth: 2,
    borderColor: commonColor.textColorApp,
    width: "100@s",
    height: "100@s",
    justifyContent: "center",
    alignItems: "center"
  },
  noButtonStopTransaction: {
    height: "110@s"
  },
  startTransaction: {
    backgroundColor: commonColor.brandSuccess
  },
  stopTransaction: {
    backgroundColor: commonColor.brandDanger
  },
  buttonTransactionDisabled: {
    backgroundColor: commonColor.buttonDisabledBg
  },
  startStopTransactionIcon: {
    fontSize: "75@s"
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
    color: commonColor.textColorApp,
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
    fontSize: "12@s",
    fontWeight: "bold",
    marginTop: Platform.OS === "ios" ? "0@s" : "-5@s",
    color: commonColor.textColorApp,
    alignSelf: "center"
  },
  subLabelStatus: {
    marginTop: "0@s"
  },
  subLabelUser: {
    marginTop: "0@s"
  },
  icon: {
    fontSize: "25@s"
  },
  userPicture: {
    height: "52@s",
    width: "52@s",
    alignSelf: "center",
    marginBottom: "5@s",
    borderRadius: "26@s",
    borderWidth: 2,
    borderColor: commonColor.textColorApp
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
