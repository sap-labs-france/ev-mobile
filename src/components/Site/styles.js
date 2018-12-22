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
    marginLeft: "3%",
    justifyContent: "space-between"
  },
  siteName: {
    fontSize: 30,
    color: commonColor.textColor,
    fontWeight: "bold"
  },
  icon: {
    fontSize: 30
  },
  detailsContent: {
    flexDirection: "row",
    marginLeft: "3%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  chargerText: {
    color: commonColor.textColor,
    fontSize: 25
  },
  badge: {
    height: 42,
    margin: 10
  },
  badgeText: {
    padding: 15,
    fontSize: 30,
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
