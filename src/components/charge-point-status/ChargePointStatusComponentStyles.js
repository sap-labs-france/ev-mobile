import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale, ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  badgeContainer: {
    paddingTop: "10@ms",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: scale(20)
  },
  connectorBadge: {
    paddingTop: "5@fs",
    height: "30@vs",
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
    fontSize: scale(15),
    paddingTop: "6@ms4",
    paddingBottom: "8@ms",
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
