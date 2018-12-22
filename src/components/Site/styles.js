import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";

const commonStyles = {
  siteContainer: {
    flex: 1,
    flexDirection: "column",
    height: "20%",
    padding: "2%",
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  siteName: {
    fontSize: 20,
    color: commonColor.textColor,
    fontWeight: "bold"
  },
  icon: {
    paddingTop: 5,
    fontSize: 25
  },
  detailsContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  chargerText: {
    color: commonColor.textColor,
    fontSize: 20
  },
  badge: {
    height: 40,
    margin: 10
  },
  badgeText: {
    padding: 11,
    fontSize: 25,
    fontWeight: "bold",
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
