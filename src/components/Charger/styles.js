import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingBottom: 15,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15
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
    fontSize: 24
  },
  siteAreaName: {
    fontStyle: "italic",
    fontSize: 14
  },
  heartbeatIcon: {
    color: "#32CD32",
    fontSize: 20
  },
  deadHeartbeatIcon: {
    color: "#D9534F",
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
