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
    paddingTop: hp("1%"),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  labelValue: {
    fontSize: hp("4%"),
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
  },
  subLabel: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: commonColor.textColor,
    marginTop: hp("-0.75%"),
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
  labelUser: {
    fontSize: hp("2.5%"),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  profilePicture: {
    height: wp("15%"),
    width: wp("15%"),
    alignSelf: "center",
    marginTop: hp("1%"),
    borderRadius: 50,
    borderWidth: 2,
    borderColor: commonColor.textColor
  }
});
