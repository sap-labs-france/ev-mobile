import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

export default StyleSheet.create({
  header: {
    height: hp("8%")
  },
  container: {
    flex: 1,
    width: null,
    height: null
  },
  content: {
    flex: 1
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: hp("2.5%"),
    width: wp("75%"),
    textAlign: "center",
    fontWeight: "bold"
  },
  imageHeader: {
    height: hp("3.7%"),
    width: wp("15%"),
    resizeMode: "contain"
  },
  spinner: {
    flex: 1
  }
});
