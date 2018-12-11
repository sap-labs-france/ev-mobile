import { Platform, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

export default StyleSheet.create({
  links: {
    paddingTop: Platform.OS === "android" ? hp("1.2%") : hp("1.5%"),
    paddingBottom: Platform.OS === "android" ? hp("1.2%") : hp("1.5%"),
    paddingLeft: wp("2.7%"),
    borderBottomWidth: 0,
    borderBottomColor: "transparent"
  },
  linkText: {
    color: commonColor.textColor,
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
    borderTopColor: commonColor.textColor
  },
  gridLogoutContainer: {
    flexDirection: "row",
    flex: 1
  },
  columnAccount: {
    flexDirection: "column",
    flexGrow: 2,
    flex: 1
  },
  buttonLogout: {
    alignSelf: "flex-start",
    backgroundColor: "transparent"
  },
  logout: {
    fontWeight: "bold",
    color: commonColor.textColor
  },
  name: {
    color: commonColor.textColor
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
    backgroundColor: commonColor.brandPrimary
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
  versionText: {
    color: commonColor.textColor,
    marginTop: hp("0.5%"),
    alignSelf: "center"
  },
  versionDate: {
    color: commonColor.textColor,
    marginTop: hp("0%"),
    alignSelf: "center"
  },
  logoContainer: {
    borderColor: commonColor.textColor,
    borderBottomWidth: 1,
    paddingBottom: hp("2%")
  },
  logo: {
    flex: 1,
    resizeMode: "contain",
    height: hp("12.5%"),
    alignSelf: "center"
  }
});
