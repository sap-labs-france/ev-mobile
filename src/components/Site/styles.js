import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

export default StyleSheet.create({
  siteContainer: {
    flexDirection: "column",
    flex: 1,
    height: hp("18%"),
    paddingTop: hp("2.3%"),
    paddingBottom: hp("2.3%"),
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  mainContent: {
    flexDirection: "row",
    marginLeft: wp("2.6%")
  },
  columnSiteName: {
    flexDirection: "column",
    width: wp("72%"),
    justifyContent: "center"
  },
  siteName: {
    fontSize: hp("2.7%"),
    fontWeight: "bold"
  },
  columnPinIcon: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center"
  },
  pinIcon: {
    fontSize: hp("4%"),
    alignSelf: "flex-start"
  },
  columnArrowIcon: {
    flexDirection: "column",
    justifyContent: "center"
  },
  detailsContent: {
    flexDirection: "row",
    flex: 1
  },
  columnFreeChargers: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: hp("5%")
  },
  freeChargersText: {
    fontSize: hp("2.4%")
  },
  columnNumberChargers: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: hp("5%")
  },
  badgeNumber: {
    fontWeight: "bold",
    height: hp("3.4%")
  },
  badgeText: {
    fontSize: hp("2.4%"),
    color: commonColor.textColor
  }
});
