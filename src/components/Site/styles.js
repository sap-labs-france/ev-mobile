import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  siteContainer: {
    flexDirection: "column",
    flex: 1,
    height: deviceWidth / 3.8,
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3"
  },
  mainContent: {
    flexDirection: "row",
    marginLeft: 10
  },
  columnSiteName: {
    flexDirection: "column",
    width: deviceWidth / 1.38,
    justifyContent: "center"
  },
  siteName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  columnPinIcon: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center"
  },
  pinIcon: {
    fontSize: 26,
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
    marginLeft: 20
  },
  freeChargersText: {
    fontSize: 16
  },
  columnNumberChargers: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20
  },
  badgeNumber: {
    fontWeight: "bold",
    height: 23
  }
});
