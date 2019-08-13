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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: "5@s",
    paddingRight: "5@s",
    borderBottomColor: commonColor.listBorderColor,
    borderBottomWidth: 1,
    backgroundColor: commonColor.headerBgColor
  },
  name: {
    color: commonColor.headerTextColor,
    fontSize: "19@s",
    marginLeft: "5@s",
    marginRight: "5@s",
    fontWeight: "bold"
  },
  sessionContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    paddingLeft:"5@s",
    paddingRight: "5@s",
    height: "80@s",
    width: "100%"
  },
  chargeDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // height: "60@s",
    // width: "80@s",
    color: commonColor.textColor
  },
  chargeValues: {
    color: commonColor.textColor,
    marginTop: "-1@s",
    fontSize: "30@s",
    fontWeight: "bold",
    textAlign: "center"
  },
  label: {
    color: commonColor.textColor,
    fontSize: "10@s",
    marginTop: "-3@s"
  },
  subLabel: {
    color: commonColor.textColor,
    fontSize: "9@s"
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
    // width: "50%"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
    // width: "50%"
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    fontSize: "10@s",
    marginRight: "5@s"
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
