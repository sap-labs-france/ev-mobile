import { StyleSheet } from "react-native";

export default StyleSheet.create({
  buttonItem: {
    flexDirection: "row"
  },
  content: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  siteNameColumn: {
    width: 210
  },
  siteName: {
    color: "#fff",
    alignSelf: "flex-start",
    fontWeight: "bold",
    height: 25
  },
  arrowIcon: {
    alignSelf: "flex-end",
  },
  detailsGrid: {
    marginTop: 10
  },
  pinIconColumn: {
    width: 15
  },
  pinIcon: {
    fontSize: 23
  },
  freeChargersColumn: {
    width: 120
  },
  freeChargersText: {
    alignSelf: "flex-start",
  },
  badge: {
    fontWeight: "bold",
    height: 23
  },
  numberChargers: {
    color: "#fff",
    fontSize: 10,
  }
});
