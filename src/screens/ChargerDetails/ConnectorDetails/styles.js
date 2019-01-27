import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: commonColor.brandPrimary,
    height: "100%"
  },
  spinner: {
    color: commonColor.textColor
  },
  backgroundImage: {
    width: "100%",
    height: scale(150)
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(-55)
  },
  startTransaction: {
    borderRadius: scale(55),
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    width: scale(110),
    height: scale(110),
    backgroundColor: commonColor.brandSuccess,
    justifyContent: "center",
    alignItems: "center"
  },
  stopTransaction: {
    borderRadius: scale(55),
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    width: scale(110),
    height: scale(110),
    backgroundColor: commonColor.brandDanger,
    justifyContent: "center",
    alignItems: "center"
  },
  startStopTransactionDisabled: {
    backgroundColor: commonColor.btnDisabledBg,
  },
  startStopTransactionIcon: {
    fontSize: scale(75)
  },
  scrollViewContainer: {
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: scale(-10)
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: scale(100)
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%"
  },
  connectorLetter: {
    marginTop: scale(5),
    marginBottom: scale(5)
  },
  label: {
    fontSize: scale(16),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  labelStatus: {
    fontSize: scale(16),
  },
  labelValue: {
    fontSize: scale(30),
    fontWeight: "bold",
  },
  labelTimeValue: {
    fontSize: scale(25),
    fontWeight: "bold",
  },
  labelUser: {
    fontSize: scale(16),
  },
  subLabel: {
    fontSize: scale(12),
    fontWeight: "bold",
    marginTop: (Platform.OS === "ios" ? 0 : scale(-5)),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  subLabelStatus: {
    marginTop: scale(0)
  },
  subLabelUser: {
    marginTop: scale(0)
  },
  icon: {
    fontSize: scale(25),
  },
  userPicture: {
    height: scale(52),
    width: scale(52),
    alignSelf: "center",
    marginBottom: scale(5),
    borderRadius: scale(26),
    borderWidth: 2,
    borderColor: commonColor.textColor
  }
};

const portraitStyles = {
};

const landscapeStyles = {
};

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
