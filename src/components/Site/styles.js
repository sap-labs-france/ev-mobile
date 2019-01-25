import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = {
  siteContainer: {
    flex: 1,
    flexDirection: "column",
    height: scale(122),
    paddingTop: scale(5),
    paddingBottom: scale(5),
    paddingLeft: scale(10),
    paddingRight: scale(10),
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
  siteName: {
    fontSize: scale(20),
    color: commonColor.textColor,
    fontWeight: "bold"
  },
  icon: {
    fontSize: scale(25)
  },
  detailedContent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  badgeContainer: {
    paddingTop: scale(5),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  badgeSuccessContainer: {
  },
  badgeOccupiedContainer: {
  },
  connectorText: {
    color: commonColor.textColor,
    marginTop: scale(-15),
    marginRight: scale(10),
    fontSize: scale(20)
  },
  connectorBadge: {
    marginTop: scale(5),
    marginLeft: scale(10),
    marginRight: scale(10),
    minWidth: scale(55)
  },
  freeConnectorBadge: {
    backgroundColor: commonColor.brandSecondary
  },
  occupiedConnectorBadge: {
    backgroundColor: commonColor.brandDanger
  },
  connectorBadgeTitle: {
    fontSize: scale(25),
    paddingTop: (Platform.OS === "ios" ? scale(3) : scale(0)),
    paddingBottom: (Platform.OS === "ios" ? scale(3) : scale(0)),
    fontWeight: "bold",
    color: commonColor.textColor,
  },
  connectorSubTitle: {
    fontSize: scale(15),
    paddingBottom: scale(5),
    marginTop: scale(5),
    marginBottom: scale(5),
    marginLeft: scale(10),
    marginRight: scale(10),
    color: commonColor.textColor,
  }
};

const portraitStyles = {
};

const landscapeStyles = {
};

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
