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
  contentButton: {
    flexDirection: "row",
    width: "100%"
  },
  buttonFilter: {
    height: "45@s",
    width: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  textButtonCloseFilter: {
    height: "100%",
    marginTop: "12@s",
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
