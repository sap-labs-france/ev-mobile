import { StyleSheet, Platform, Dimensions } from "react-native";

const primary = require("../../theme/variables/commonColor").brandPrimary;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  header: {
    flexDirection: "row"
  },
  arrowIconColumn: {
    flexDirection: "column"
  },
  chargerNameColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: deviceWidth / 1.41,
    paddingTop: 7
  },
  chargerName: {
    fontSize: 20,
    fontWeight: "bold"
  },
  connectorName: {
    fontWeight: "bold",
    fontSize: 13
  },
  backgroundContainer: {
    borderColor: "#FFFFFF",
    borderBottomWidth: 3,
    paddingTop: 10
  },
  outerCircle: {
    borderRadius: 62.5,
    borderStyle: "solid",
    width: deviceWidth / 3,
    height: deviceHeight / 5.3,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  innerCircleStartTransaction: {
    borderRadius: 60,
    borderStyle: "solid",
    width: deviceWidth / 3 - 5,
    height: deviceHeight / 5.3 - 5,
    backgroundColor: "#5cb85c",
    justifyContent: "center",
    alignItems: "center"
  },
  startStopTransactionIcon: {
    fontSize: 70
  },
  innerCircleStopTransaction: {
    borderRadius: 60,
    borderStyle: "solid",
    width: deviceWidth / 3 - 5,
    height: deviceHeight / 5.3 - 5,
    backgroundColor: "#d9534f",
    justifyContent: "center",
    alignItems: "center"
  },
  backgroundImage: {
    width: deviceWidth,
    height: deviceHeight / 4.3
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 95
  },
  scrollViewContainer: {
    marginTop: 55
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
  undefinedStatusText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
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
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent",
    color: "#FFFFFF"
  },
  profilePic: {
    height: 45,
    width: 45,
    borderRadius: Platform.OS === "android" ? 40 : 20
  },
  footerContainer: {
    paddingTop: 5
  }
});
