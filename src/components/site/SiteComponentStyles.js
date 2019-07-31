import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "5@s",
    paddingBottom: "5@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor
  },
  connectorContent: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "10@s",
    paddingBottom: "10@s",
    borderBottomColor: commonColor.listBorderColor
  },
  name: {
    paddingTop: "3@s",
    fontSize: "20@s",
    color: commonColor.textColorApp
  },
  icon: {
    fontSize: "30@s",
    marginLeft: "10@s",
    marginRight: "10@s"
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
