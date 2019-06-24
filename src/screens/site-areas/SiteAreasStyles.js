import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
// import { Platform } from "react-native";
// import { scale } from "react-native-size-matters";

const commonStyles = {
  content: {
    flex: 1
  },
  spinner: {
    flex: 1
  }
};

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
