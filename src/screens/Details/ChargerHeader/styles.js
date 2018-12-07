import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../../theme/variables/commonColor";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
  },
  arrowIconColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerIcons: {
    backgroundColor: "transparent",
    color: commonColor.textColor
  },
  imageHeader: {
    height: hp("3.7%"),
    width: wp("15%"),
    resizeMode: "contain"
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: hp("2.5%"),
    width: wp("75%"),
    textAlign: "center",
    fontWeight: "bold"
  },
  subTitleHeader: {
    fontWeight: "bold",
    color: commonColor.textColor,
    fontSize: hp("2%")
  },
  detailsContainer: {
  },
  backgroundImage: {
    width: wp("100%"),
    height: hp("25%")
  },
  spinner: {
    marginTop: hp("18%")
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("20%")
  },
  startTransaction: {
    borderRadius: 50,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    width: wp("28%"),
    height: wp("28%"),
    backgroundColor: commonColor.brandSuccess,
    justifyContent: "center",
    alignItems: "center"
  },
  stopTransaction: {
    borderRadius: 50,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: commonColor.textColor,
    width: wp("28%"),
    height: wp("28%"),
    backgroundColor: commonColor.brandDanger,
    justifyContent: "center",
    alignItems: "center"
  },
  startStopTransactionIcon: {
    fontSize: hp("10%")
  },
});

