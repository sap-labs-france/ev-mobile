import deepmerge from "deepmerge";
import ResponsiveStylesheet from "react-native-responsive-stylesheet";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  contentFilter: {
    backgroundColor: "white",
    padding: "15@s",
    justifyContent: "flex-start",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonCloseFilter: {
    height: "50@s",
  },
  textButtonCloseFilter: {
    height: "100%",
    marginTop: "15@s",
    fontSize: "18@s"
  }
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
