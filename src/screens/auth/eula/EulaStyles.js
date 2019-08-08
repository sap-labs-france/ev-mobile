import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import { StyleSheet } from "react-native";
import commonColor from "../../../theme/variables/commonColor";
import deepmerge from "deepmerge";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
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

const portraitStyles = {};

const landscapeStyles = {
  button: {
    width: "65%"
  },
  inputIcon: {
    width: "7%"
  },
  inputField: {
    width: "58%"
  }
};

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
