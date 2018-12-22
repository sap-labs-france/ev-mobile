import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../theme/variables/commonColor";
import deepmerge from "deepmerge";

const commonStyles = {
  header: {
  },
  imageHeader: {
    width: 60,
    resizeMode: "contain"
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: 25,
    width: "75%",
    textAlign: "center",
    fontWeight: "bold"
  },
  content: {
    flex: 1
  },
  spinner: {
    flex: 1
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
