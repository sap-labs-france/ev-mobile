import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  badgeContainer: {
    paddingTop: "10@ms",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "20@s"
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
    backgroundColor: commonColor.brandInfo
  },
  occupiedConnectorBadge: {
    backgroundColor: commonColor.brandDanger
  },
  badgeSuccessContainer: {},
  badgeOccupiedContainer: {},
  connectorBadgeTitle: {
    minWidth: "35@s",
    textAlign: "center",
    fontSize: "20@s",
    paddingTop: "8@ms4",
    paddingBottom: "8@ms",
    fontWeight: "bold",
    color: commonColor.textColorApp
  },
  connectorSubTitle: {
    fontSize: "15@s",
    paddingBottom: "5@s",
    marginTop: "5@s",
    marginBottom: "5@s",
    marginLeft: "10@s",
    marginRight: "10@s",
    color: commonColor.textColorApp
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
