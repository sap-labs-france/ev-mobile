import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";
import Constants from "../../utils/Constants";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.brandPrimaryDark
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "5@s",
    paddingRight: "5@s",
    borderBottomColor: commonColor.listBorderColor,
    borderBottomWidth: 1,
    backgroundColor: commonColor.headerBgColor
  },
  name: {
    color: commonColor.headerTextColor,
    fontSize: "20@s",
    marginLeft: "5@s",
    fontWeight: "bold"
  },
  heartbeatButton: {
    marginRight: "5@s"
  },
  heartbeatIcon: {
    color: commonColor.brandSuccess,
    fontSize: "18@s"
  },
  deadHeartbeatIcon: {
    color: commonColor.brandDanger,
    fontSize: "18@s"
  },
  connectorsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap"
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
