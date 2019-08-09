import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";
import { Platform } from "react-native";
import Constants from "../../utils/Constants";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "5@s",
    paddingBottom: "5@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.headerBgColor
  },
  connectorContent: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "12@s",
    paddingBottom: "12@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.brandPrimaryDark
  },
  name: {
    paddingTop: Platform.OS === "ios" ? "4@s" : 0,
    fontSize: "20@s",
    fontWeight: "bold",
    color: commonColor.headerTextColor
  },
  icon: {
    fontSize: "30@s",
    marginLeft: "10@s",
    marginRight: "10@s",
    color: commonColor.headerTextColor
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
