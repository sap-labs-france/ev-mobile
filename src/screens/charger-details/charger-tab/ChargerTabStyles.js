import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100%"
  },
  spinner: {
    color: commonColor.textColor
  },
  tabHeader: {},
  tabIcon: {
    fontSize: scale(20),
    paddingBottom: scale(5)
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
