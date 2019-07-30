import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";

const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: commonColor.brandPrimary
  },
  content: {
    flex: 1
  },
  spinner: {
    flex: 1
  },
  background: {
    flex: 1
  },
  imageBackground: {
    resizeMode: "cover"
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
