import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';

const commonStyles = {
  backgroundImage: {
    width: "100%",
    height: scale(150)
  },
  spinner: {
    // marginTop: hp("18%")
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    marginTop: scale(-50)
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
    alignItems: "center",
    marginTop: scale(-50)
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
    height: scale(110)
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "50%"
  },
  label: {
    fontSize: scale(20),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  labelValue: {
    fontSize: scale(35),
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
  },
  labelTimeValue: {
    fontSize: scale(30),
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
  },
  subLabel: {
    fontSize: scale(10),
    fontWeight: "bold",
    marginTop: scale(-5),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  icon: {
    fontSize: scale(30),
  },
  labelUser: {
    fontSize: scale(15),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  subLabelUser: {
    fontSize: scale(10),
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
  },
  userPicture: {
    height: scale(50),
    width: scale(50),
    alignSelf: "center",
    borderRadius: scale(25),
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
