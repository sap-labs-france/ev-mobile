import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingBottom: 5
  },
  listDividerContainer: {
    backgroundColor: "transparent",
    paddingBottom: 7,
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  chargerName: {
    fontWeight: "bold",
    fontSize: 20
  },
  siteAreaName: {
    fontStyle: "italic",
    fontSize: 14
  },
  heartbeatIcon: {
    color: "#32CD32",
    fontSize: 20
  },
  listContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    flexWrap: "wrap",
    paddingTop: 10
  }
});
