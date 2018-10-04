import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    paddingBottom: 35,
    paddingLeft: 5
  },
  chargerName: {
    alignSelf: "center"
  }
});
