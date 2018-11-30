import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

const primary = require("../../theme/variables/commonColor").brandPrimary;

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
  imageHeader: {
    height: hp("3.8%"),
    width: wp("25.3%"),
    resizeMode: "contain"
  },
  spinner: {
    flex: 1
  }
});
