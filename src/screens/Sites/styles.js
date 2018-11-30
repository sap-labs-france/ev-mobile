import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

const primary = require("../../theme/variables/commonColor").brandPrimary;

export default StyleSheet.create({
  header: {
    height: hp("8%")
  },
  bg: {
    backgroundColor: primary
  },
  newsContent: {
    flexDirection: "column",
    paddingTop: hp("3%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    paddingBottom: hp("3%"),
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  newsHeader: {
    color: "#fff",
    fontWeight: "bold"
  },
  newsLink: {
    color: "#fff",
    fontSize: hp("1.8%"),
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    alignSelf: "flex-end"
  },
  newsTypeText: {
    color: "#fff",
    fontSize: hp("1.8%"),
    fontWeight: "bold",
    paddingBottom: hp("0.7%")
  },
  imageHeader: {
    height: hp("3.7%"),
    width: wp("25%"),
    resizeMode: "contain"
  },
  content: {
    flex: 1
  },
  spinner: {
    flex: 1
  }
});
