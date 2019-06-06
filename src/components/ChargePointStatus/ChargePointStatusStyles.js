import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  badgeContainer: {
    paddingTop: scale(10),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  connectorBadge: {
    marginTop: scale(5),
    paddingTop: scale(5),
    height: scale(30),
    alignSelf: "center"
  },
  connectorBadgeText: {
    fontWeight: "bold",
    alignSelf: "center"
  },
  freeConnectorBadge: {
    backgroundColor: commonColor.brandSecondary
  },
  occupiedConnectorBadge: {
    backgroundColor: commonColor.brandDanger
  },
  badgeSuccessContainer: {},
  badgeOccupiedContainer: {},
  connectorBadgeTitle: {
    minWidth: scale(35),
    textAlign: "center",
    fontSize: scale(20),
    paddingTop: Platform.OS === "ios" ? scale(4) : 0,
    paddingBottom: Platform.OS === "ios" ? scale(4) : 0,
    fontWeight: "bold",
    color: commonColor.textColor
  },
  connectorSubTitle: {
    fontSize: scale(15),
    paddingBottom: scale(5),
    marginTop: scale(5),
    marginBottom: scale(5),
    marginLeft: scale(10),
    marginRight: scale(10),
    color: commonColor.textColor
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
