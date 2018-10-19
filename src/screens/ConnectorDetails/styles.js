import { StyleSheet, Platform } from "react-native";

const primary = require("../../theme/variables/commonColor").brandPrimary;

export default StyleSheet.create({
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent",
    color: "#FFFFFF"
  },
  profilePic: {
    height: 45,
    width: 45,
    borderRadius: Platform.OS === "android" ? 40 : 20
  }
});
