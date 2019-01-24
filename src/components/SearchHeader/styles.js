import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  header: {
    height: scale(45),
    paddingTop: scale(10),
    paddingBottom: scale(5),
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3"
  },
  items: {
    backgroundColor: "black",
    color: commonColor.textColor,
  },
  icon: {
    color: commonColor.textColor
  },
  text: {
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

