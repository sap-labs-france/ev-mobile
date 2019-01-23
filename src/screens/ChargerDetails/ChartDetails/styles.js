import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import deepmerge from "deepmerge";

const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  chartContainer: {
    flex: 1
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    color: commonColor.textColor
  },
  chart: {
    height: "100%"
  },
  notAuthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  notAuthorizedText: {
    fontSize: scale(20),
    color: commonColor.textColor
  },
  notAuthorizedIcon: {
    fontSize: scale(75),
    color: commonColor.textColor
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
