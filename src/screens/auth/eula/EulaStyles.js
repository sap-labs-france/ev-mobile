import { StyleSheet } from "react-native";
import commonColor from "../../../theme/variables/commonColor";

export default StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  spinner: {
    flex: 2,
    color: commonColor.textColor,
  },
});
