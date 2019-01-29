import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  header: {
    height: scale(40),
    paddingTop: scale(5),
    paddingBottom: scale(5),
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
  },
  leftHeader: {
  },
  bodyHeader: {
    flexGrow: 2,
  },
  rightHeader: {
  },
  logoHeader: {
    width: scale(45),
    resizeMode: "contain"
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: scale(20),
  },
  titleHeaderWithSubTitle: {
    fontSize: scale(18),
  },
  subTitleHeader: {
    fontWeight: "bold",
    color: commonColor.textColor,
    fontSize: scale(12),
    marginTop: (Platform.OS === "ios" ? scale(-2) : scale(-5)),
  },
  iconHeader: {
    fontSize: scale(25),
    alignSelf: "center",
  },
  leftIconHeader: {
    marginLeft: scale(-5)
  },
  rightIconHeader: {
    marginRight: scale(5)
  },
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

