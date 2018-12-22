import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale, moderateScale } from 'react-native-size-matters';

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
    fontSize: moderateScale(20),
    color: commonColor.textColor,
    fontWeight: "bold"
  },
  icon: {
    paddingTop: 5,
    fontSize: moderateScale(25)
  },
  detailsContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  chargerText: {
    color: commonColor.textColor,
    fontSize: moderateScale(20)
  },
  badge: {
    margin: scale(10),
    backgroundColor: commonColor.brandSecondary
  },
  badgeText: {
    fontSize: moderateScale(25),
    marginTop: -2,
    marginLeft: -2,
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
