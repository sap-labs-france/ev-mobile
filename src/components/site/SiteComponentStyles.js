import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
// import { Platform } from "react-native";

const commonStyles = {
  container: {
    flex: 1,
    flexDirection: "column",
    height: scale(122),
    paddingTop: scale(5),
    paddingBottom: scale(5),
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: scale(5),
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor
  },
  name: {
    fontSize: scale(20),
    color: commonColor.textColor,
    fontWeight: "bold"
  },
  icon: {
    fontSize: scale(25),
    marginLeft: scale(10),
    marginRight: scale(10)
  },
  detailedContent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: scale(5),
    alignItems: "center"
  },
  connectorText: {
    color: commonColor.textColor,
    marginTop: scale(-15),
    marginRight: scale(10),
    fontSize: scale(20)
  }
};

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
