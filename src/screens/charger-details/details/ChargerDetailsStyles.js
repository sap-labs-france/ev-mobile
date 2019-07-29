import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  scrollViewContainer: {
    backgroundColor: commonColor.brandPrimary
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  spinner: {
    flex: 1,
    color: commonColor.textColor
  },
  columnContainer: {
    height: "75@s",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: "20@s",
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
  },
  value: {
    fontSize: "20@s",
    color: commonColor.textColor
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
