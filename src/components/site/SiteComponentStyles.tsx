import deepmerge from "deepmerge";
import { Platform } from "react-native";
import ResponsiveStylesheet from "react-native-responsive-stylesheet"
import { ScaledSheet } from "react-native-size-matters";
import commonColor from "../../theme/variables/commonColor";

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
  headerName: {
    paddingTop: Platform.OS === "ios" ? "4@s" : 0,
    fontSize: "20@s",
    fontWeight: "bold",
    color: commonColor.headerTextColor
  },
  subHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  connectorContent: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "12@s",
    paddingBottom: "12@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.brandPrimaryDark
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

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
