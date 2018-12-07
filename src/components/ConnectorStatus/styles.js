import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

export default StyleSheet.create({
  connectorStatus: {
  },
  statusLetter: {
    color: commonColor.textColor,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: hp("4.75%")
  },
  statusGreen: {
    backgroundColor: commonColor.brandSuccess,
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: 50
  },
  statusRed: {
    backgroundColor: commonColor.brandDanger,
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: 50
  },
  statusOrange: {
    backgroundColor: commonColor.brandWarning,
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: 50
  }
});
