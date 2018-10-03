import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    paddingBottom: 25,
  },
  chargerName: {
    alignSelf: "center"
  }
});
