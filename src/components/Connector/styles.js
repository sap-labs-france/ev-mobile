import { StyleSheet, Dimensions, Platform } from "react-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  connectorContainer: {
    flexDirection: "row",
    marginTop: 5
  },
  connectorStatus: {
    flexDirection: "column",
    justifyContent: "center"
  },
  badge: {
    justifyContent: "center",
    borderRadius: 60,
    height: deviceHeight / 14.7,
    width: deviceWidth / 8.3
  },
  badgeText: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: Platform.OS === "android" ? -2 : -5,
    paddingTop: 10
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
    width: deviceWidth / 3.4,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5
  },
  statusDetailsContainer: {
    width: deviceWidth / 3.1
  },
  statusText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  energy: {
    fontWeight: "bold",
    fontSize: 35,
    textAlign: "center"
  },
  currentConsumptionUnity: {
    marginTop: -3,
    fontSize: 10.5
  },
  maxEnergy: {
    fontSize: 10.5,
    textAlign: "center",
    marginTop: -3,
  },
  statusDetailsContainerNoConsumption : {
    width: deviceWidth / 3.1
  },
  sizeConnectorImage: {
    height: 35,
    width: 40,
    marginTop: 5
  },
  maxPowerContainer: {
    flexDirection: "column"
  },
  power: {
    fontWeight: "bold",
    fontSize: 35,
    textAlign: "center"
  },
  connectorType: {
    fontSize: 10.5,
    textAlign: "center"
  }
});
