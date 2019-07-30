import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    backgroundColor: commonColor.brandPrimary
  },
  spinner: {
    color: commonColor.textColorApp
  },
  tabHeader: {
    // backgroundColor: commonColor.brandSecondary
  },
  tabIcon: {
    fontSize: "20@s",
    paddingBottom: "5@s"
  },
  background: {
    flex: 1
  },
  imageBackground: {
    resizeMode: "cover"
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
