import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = ScaledSheet.create({
  header: {
    height: "45@s",
    paddingTop: "5@s",
    paddingBottom: "5@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.brandPrimaryDark
  },
  leftHeader: {},
  bodyHeader: {
    flexGrow: 2,
    paddingLeft: Platform.OS === "ios" ? 0 : "50@s"
  },
  rightHeader: {},
  logoHeader: {
    width: "45@s",
    resizeMode: "contain"
  },
  titleHeader: {
    color: commonColor.inverseTextColor,
    fontSize: "18@s"
  },
  titleHeaderWithSubTitle: {
    fontSize: "18@s"
  },
  subTitleHeader: {
    color: commonColor.inverseTextColor,
    fontWeight: "bold",
    fontSize: "12@s",
    marginTop: Platform.OS === "ios" ? "-2@s" : "-3@s"
  },
  iconHeader: {
    color: commonColor.inverseTextColor,
    fontSize: "30@s"
  },
  leftButtonHeader: {
    paddingLeft: 0
  },
  rightButtonHeader: {
    paddingLeft: 0
  }
});

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
