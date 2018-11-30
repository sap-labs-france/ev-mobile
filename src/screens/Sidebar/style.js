import { Platform, StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

const primary = require("../../theme/variables/commonColor").brandPrimary;

export default StyleSheet.create({
  links: {
    paddingTop: Platform.OS === "android" ? hp("1.2%") : hp("1.5%"),
    paddingBottom: Platform.OS === "android" ? hp("1.2%") : hp("1.5%"),
    paddingLeft: wp("2.7%"),
    borderBottomWidth: 0,
    borderBottomColor: "transparent"
  },
  linkText: {
    paddingLeft: wp("4%")
  },
  logoutContainer: {
    padding: 30,
    paddingTop: 0
  },
  logoutbtn: {
    paddingTop: hp("4.5%"),
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF"
  },
  gridLogoutContainer: {
    flexDirection: "row",
    flex: 1
  },
  columnAccount: {
    flexDirection: "column",
    flex: 1
  },
  buttonLogout: {
    alignSelf: "flex-start",
    backgroundColor: "transparent"
  },
  logout: {
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  name: {
    color: "#FFFFFF"
  },
  columnThumbnail: {
    flexDirection: "column",
    flex: 1
  },
  buttonThumbnail: {
    alignSelf: "flex-end"
  },
  background: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: primary
  },
  drawerContent: {
    paddingTop: Platform.OS === "android" ? hp("3%") : hp("4.5%"),
    flex: 1
  },
  profilePic: {
    height: hp("6%"),
    width: wp("10.6%"),
    borderRadius: Platform.OS === "android" ? 40 : 20
  },
  logoContainer: {
    borderColor: "#FFFFFF",
    borderBottomWidth: 1,
    paddingBottom: hp("4.5%")
  },
  logo: {
    flex: 1,
    resizeMode: "contain",
    height: hp("12.5%"),
    alignSelf: "center"
  }
});
