import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    backgroundColor: commonColor.brandPrimary
  },
  scrollViewContainer: {},
  viewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  spinner: {
    flex: 1,
    color: commonColor.textColorApp
  },
  columnContainer: {
    height: "75@s",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: "20@s",
    fontWeight: "bold",
    color: commonColor.textColorApp,
    alignSelf: "center"
  },
  value: {
    fontSize: "20@s",
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
