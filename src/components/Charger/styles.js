import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    paddingBottom: 5,
    paddingLeft: 5
  },
  listContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    paddingBottom: 15
  },
  connectorContainer: {
    flexDirection: "row"
  },
  connectorStatus: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  connectorTextInfo: {
    fontSize: 10
  },
  connectorErrorCodeText: {
    fontSize: 7
  },
  status: {
    flexDirection: "column",
    width: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  statusText: {
    fontWeight: "bold"
  }
});
