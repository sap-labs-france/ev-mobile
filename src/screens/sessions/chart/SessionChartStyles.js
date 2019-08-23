import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../../theme/variables/commonColor";
import deepmerge from "deepmerge";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColor.containerBgColor,
    paddingBottom: "5@s"
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    color: commonColor.textColor
  },
  chart: {
    height: "100%"
  },
  chartWithHeader: {
    height: "93%"
  },
  notAuthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8@s",
    backgroundColor: commonColor.headerBgColorLight
  },
  headerValue: {
    fontSize: "15@s",
    fontWeight: "bold"
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
