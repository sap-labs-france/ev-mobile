import deepmerge from "deepmerge";
import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  spinnerContainer: {
    padding: "10@s",
    alignSelf: "center"
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
