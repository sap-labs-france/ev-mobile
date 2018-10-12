import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

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
    justifyContent: "space-between"
  },
  chargerName: {
    fontWeight: "bold"
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
  },
  connectorContainer: {
    flexDirection: "row",
    paddingTop: 15
  },
  connectorStatus: {
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10
  },
  badge: {
    justifyContent: "center"
  },
  connectorTextInfoType: {
    fontSize: 10,
    paddingTop: 5
  },
  connectorTextInfo: {
    fontSize: 10,
  },
  connectorErrorCodeText: {
    fontSize: 9,
    color: "#FF0000"
  },
  status: {
    flexDirection: "column",
    width: 100,
    alignItems: "center",
    paddingBottom: 10
  },
  statusText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17
  }
});
