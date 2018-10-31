import { Platform, StyleSheet } from "react-native";

const primary = require("../../theme/variables/commonColor").brandPrimary;

export default StyleSheet.create({
  links: {
    paddingTop: Platform.OS === "android" ? 8 : 10,
    paddingBottom: Platform.OS === "android" ? 8 : 10,
    paddingLeft: Platform.OS === "android" ? 10 : 10,
    borderBottomWidth: Platform.OS === "android" ? 0 : 0,
    borderBottomColor: "transparent"
  },
  linkText: {
    paddingLeft: 15
  },
  logoutContainer: {
    padding: 30,
    paddingTop: 0
  },
  logoutbtn: {
    paddingTop: 30,
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
    paddingTop: Platform.OS === "android" ? 20 : 30,
    flex: 1
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: Platform.OS === "android" ? 40 : 20
  }
});
