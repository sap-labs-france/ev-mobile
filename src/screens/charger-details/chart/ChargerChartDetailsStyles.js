import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../../theme/variables/commonColor";
import deepmerge from "deepmerge";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColor.containerBgColor
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    color: commonColor.textColorApp
  },
  chart: {
    height: "100%"
  },
  notAuthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  notAuthorizedText: {
    fontSize: "20@s",
    color: commonColor.textColorApp
  },
  notAuthorizedIcon: {
    fontSize: "75@s",
    color: commonColor.textColorApp
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
