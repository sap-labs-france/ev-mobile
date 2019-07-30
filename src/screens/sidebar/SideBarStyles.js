import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../theme/variables/commonColor";
import deepmerge from "deepmerge";
import { Platform } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  background: {
    flex: 1,
    backgroundColor: commonColor.brandPrimary
  },
  drawerContent: {
    paddingTop: "3%",
    flex: 1
  },
  logoContainer: {
    borderColor: commonColor.textColorApp,
    borderBottomWidth: 1,
    padding: "5@s"
  },
  logo: {
    resizeMode: "contain",
    width: "100@s",
    height: "50@s",
    alignSelf: "center",
    margin: "5@s"
  },
  versionText: {
    color: commonColor.textColorApp,
    fontSize: "14@s",
    margin: "2@s",
    alignSelf: "center"
  },
  versionDate: {
    color: commonColor.textColorApp,
    fontSize: "14@s",
    alignSelf: "center",
    marginBottom: "2@s"
  },
  links: {
    borderBottomWidth: "0@s",
    borderBottomColor: "transparent",
    height: Platform.OS === "ios" ? undefined : "25@s",
    marginTop: Platform.OS === "ios" ? undefined : "10@s",
    paddingBottom: Platform.OS === "ios" ? "0@s" : "15@s"
  },
  linkText: {
    color: commonColor.textColorApp,
    fontSize: "16@s",
    paddingLeft: "10@s"
  },
  logoutContainer: {
    padding: 30,
    paddingTop: "0@s"
  },
  logoutButton: {
    paddingTop: "10@s",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: commonColor.textColorApp
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
  logoutText: {
    fontWeight: "bold",
    fontSize: "14@s",
    color: commonColor.textColorApp
  },
  userName: {
    paddingTop: "5@s",
    fontSize: "14@s",
    color: commonColor.textColorApp
  },
  columnThumbnail: {
    flex: 1,
    flexDirection: "column"
  },
  buttonThumbnail: {
    alignSelf: "flex-end"
  },
  profilePic: {
    width: "40@s",
    height: "40@s",
    borderRadius: "20@s"
  }
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet() {
  return ResponsiveStyleSheet.select([
    {
      query: { orientation: "landscape" },
      style: deepmerge(commonStyles, landscapeStyles)
    },
    {
      query: { orientation: "portrait" },
      style: deepmerge(commonStyles, portraitStyles)
    }
  ]);
}
