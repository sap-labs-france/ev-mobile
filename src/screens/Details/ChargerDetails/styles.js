import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../../theme/variables/commonColor";

export default StyleSheet.create({
  scrollViewContainer: {
    marginTop: hp("5%")
  },
  content: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp("16.5%")
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: wp("50%")
  },
  titleHeader: {
    fontSize: hp("3%"),
    fontWeight: "bold",
    paddingTop: hp("1.5%"),
    paddingBottom: hp("0.7%"),
    color: commonColor.textColor,
    alignSelf: "center"
  },
  infoContent: {
    color: commonColor.textColor,
    fontSize: hp("2.5%")
  }
});
