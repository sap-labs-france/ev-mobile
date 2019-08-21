import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";
import { Platform } from "react-native";

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
    alignItems: "center",
    padding: "5@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.headerBgColor
  },
  headerName: {
    color: commonColor.headerTextColor,
    fontSize: "18@s",
    marginLeft: "5@s",
    marginRight: "5@s",
    fontWeight: "bold"
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5@s",
    paddingLeft: "8@s",
    paddingRight: "8@s",
    backgroundColor: commonColor.headerBgColorLight
  },
  subHeaderName: {
    color: commonColor.headerTextColor,
    fontSize: "16@s"
  },
  sessionContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    paddingLeft: "5@s",
    paddingRight: "5@s",
    height: "80@s",
    width: "100%"
  },
  label: {
    color: commonColor.textColor,
    fontSize: "10@s",
    marginTop: "-3@s"
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    fontSize: "30@s",
    justifyContent: "flex-end"
  },
  labelValue: {
    fontSize: "15@s"
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
