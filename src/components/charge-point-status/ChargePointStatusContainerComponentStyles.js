import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: scale(5),
    alignItems: "center"
  },
  connectorText: {
    color: commonColor.textColor,
    marginTop: scale(-15),
    marginRight: scale(10),
    fontSize: scale(20)
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
