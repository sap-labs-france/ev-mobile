import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    height: "122@s",
    paddingTop: "5@s",
    paddingBottom: "5@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: "5@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor
  },
  name: {
    fontSize: "20@s",
    color: commonColor.textColorApp,
    fontWeight: "bold"
  },
  icon: {
    fontSize: "25@s",
    marginLeft: "10@s",
    marginRight: "10@s"
  },
  detailedContent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: "5@s",
    alignItems: "center"
  },
  connectorText: {
    color: commonColor.textColorApp,
    marginTop: "-15@s",
    marginRight: "10@s",
    fontSize: "20@s"
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
