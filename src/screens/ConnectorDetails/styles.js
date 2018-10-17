import { StyleSheet, Platform } from "react-native";

const primary = require("../../theme/variables/commonColor").brandPrimary;

export default StyleSheet.create({
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent"
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: Platform.OS === "android" ? 40 : 20
  }
});
