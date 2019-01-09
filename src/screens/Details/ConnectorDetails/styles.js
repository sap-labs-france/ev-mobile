import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  backgroundImage: {
    width: "100%",
    height: scale(150)
  },
  spinner: {
    color: commonColor.textColor
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(-50)
  },
  startTransaction: {
    borderRadius: scale(50),
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    width: scale(100),
    height: scale(100),
    backgroundColor: commonColor.brandSuccess,
    justifyContent: "center",
    alignItems: "center"
  },
  stopTransaction: {
    borderRadius: scale(50),
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    width: scale(100),
    height: scale(100),
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
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
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
  subLabel: {
    fontSize: scale(12),
    fontWeight: "bold",
    marginTop: (Platform.OS === "ios" ? 0 : scale(-5)),
    color: commonColor.textColor,
    alignSelf: "center"
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
  },
  labelUser: {
    fontSize: scale(16),
  },
  subLabelUser: {
    fontSize: scale(12),
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
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
