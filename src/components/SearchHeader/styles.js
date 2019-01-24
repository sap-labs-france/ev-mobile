import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  container: {
    height: scale(45),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    flexDirection: "row",
		alignItems: "center",
 },
  input: {
    color: commonColor.textColor,
    lineHeight: 24,
    height: scale(25)
  },
  icon: {
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

