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
    borderBottomColor: commonColor.listBorderColor
  },
  leftHeader: {},
  bodyHeader: {
    flexGrow: 2
  },
  rightHeader: {},
  logoHeader: {
    width: "50@s",
    resizeMode: "contain"
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: "20@s"
  },
  titleHeaderWithSubTitle: {
    fontSize: "18@s"
  },
  subTitleHeader: {
    fontWeight: "bold",
    color: commonColor.textColor,
    fontSize: "12@s",
    marginTop: Platform.OS === "ios" ? "-2@s" : "-3@s"
  },
  iconHeader: {
    fontSize: "30@s",
    alignSelf: "center"
  },
  leftIconHeader: {
    marginLeft: "-5@s"
  },
  rightIconHeader: {
    marginLeft: "10@s"
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
