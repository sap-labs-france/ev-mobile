import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';

const commonStyles = {
  siteContainer: {
    flex: 1,
    flexDirection: "column",
    height: "20%",
    paddingTop: "2%",
    paddingBottom: "2%",
    paddingLeft: "4%",
    paddingRight: "4%",
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  siteName: {
    fontSize: scale(20),
    color: commonColor.textColor,
    fontWeight: "bold"
  },
  icon: {
    paddingTop: 5,
    fontSize: scale(25)
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  badgeContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  badgeSuccessContainer: {
    borderRightWidth: 1,
    borderRightColor: "#D3D3D3"
  },
  badgeOccupiedContainer: {
  },
  connectorText: {
    color: commonColor.textColor,
    marginRight: scale(10),
    fontSize: scale(20)
  },
  connectorBadge: {
    marginTop: scale(5),
    marginLeft: scale(10),
    marginRight: scale(10)
  },
  freeConnectorBadge: {
    backgroundColor: commonColor.brandSecondary
  },
  occupiedConnectorBadge: {
    backgroundColor: commonColor.brandDanger
  },
  connectorBadgeTitle: {
    fontSize: scale(25),
    // marginTop: -2,
    // marginLeft: -2,
    padding: scale(5),
    fontWeight: "bold",
    color: commonColor.textColor,
  },
  connectorSubTitle: {
    fontSize: scale(15),
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
