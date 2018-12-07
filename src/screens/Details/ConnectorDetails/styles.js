import { StyleSheet, Platform, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../../theme/variables/commonColor";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  scrollViewContainer: {
    marginTop: hp("9.7%")
  },
  content: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp("17%")
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: wp("50%")
  },
  secondColumnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  badgeContainer: {
    justifyContent: "center",
    height: hp("8%"),
    width: width > 500 ? wp("10.6%") : wp("13.2%"),
    alignItems: "center",
    borderRadius: 150
  },
  badgeText: {
    fontSize: hp("4.5%"),
    color: commonColor.textColor
  },
  label: {
    fontSize: hp("3%"),
    fontWeight: "bold",
    paddingTop: hp("1.5%"),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  subLabel: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    alignSelf: "center"
  },
  iconSize: {
    fontSize: hp("5.5%")
  },
  currentConsumptionContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  energyConsumedContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  energyConsumedNumber: {
    fontWeight: "bold",
    fontSize: hp("3.7%"),
    paddingTop: hp("1.5%")
  },
  headerIcons: {
    fontSize: hp("4.5%"),
    backgroundColor: "transparent",
    color: commonColor.textColor
  },
  profilePic: {
    height: hp("6.7%"),
    width: wp("12%"),
    alignSelf: "center",
    borderRadius: Platform.OS === "android" ? 40 : 20
  }
});
