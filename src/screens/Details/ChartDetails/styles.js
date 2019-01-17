import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";

const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  chart: {
    height: "100%"
  }
};

const portraitStyles = {
};

const landscapeStyles = {
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
