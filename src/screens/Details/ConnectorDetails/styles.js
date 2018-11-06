import { StyleSheet, Platform, Dimensions } from "react-native";

const primary = require("../../../theme/variables/commonColor").brandPrimary;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  scrollViewContainer: {
    marginTop: 65
  },
  content: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: deviceHeight / 6.05
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: deviceWidth / 2
  },
  badgeContainer: {
    justifyContent: "center",
    height: deviceHeight / 16.6,
    width: deviceWidth / 9.3,
    alignItems: "center",
    borderRadius: 50
  },
  badgeText: {
    fontSize: 30,
    color: "#FFFFFF"
  },
  connectorStatus: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
    alignSelf: "center"
  },
  undefinedStatusText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
    alignSelf: "center"
  },
  statusText: {
    fontSize: 17,
    fontWeight: "bold",
    paddingTop: 10,
    alignSelf: "center"
  },
  tagIdText: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "center"
  },
  userInfoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  currentConsumptionText: {
    fontWeight: "bold",
    fontSize: 25,
    paddingTop: 10
  },
  kWText: {
    fontSize: 12
  },
  iconSize: {
    fontSize: 37
  },
  currentConsumptionContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  timerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  energyConsumedContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  energyConsumedNumber: {
    fontWeight: "bold",
    fontSize: 25,
    paddingTop: 10
  },
  energyConsumedText: {
    fontSize: 12
  },
  faultedContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  faultedText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
    alignSelf: "center",
    color: "#FF0000"
  },
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent",
    color: "#FFFFFF"
  },
  profilePic: {
    height: 45,
    width: 45,
    alignSelf: "center",
    borderRadius: Platform.OS === "android" ? 40 : 20
  }
});
