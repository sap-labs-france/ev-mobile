import { StyleSheet, Dimensions, Platform } from "react-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  header: {
    flexDirection: "row"
  },
  arrowIconColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent",
    color: "#FFFFFF"
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
  detailsContainer: {
    paddingTop: 10
  },
  backgroundImage: {
    width: deviceWidth,
    height: deviceHeight / 4.3
  },
  spinner: {
    marginTop: 120
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:  Platform.OS === "ios" ? 95 : 85
  },
  outerCircle: {
    borderRadius: 150,
    borderStyle: "solid",
    width: Platform.OS === "ios" ? deviceWidth / 3 : deviceWidth / 2.93,
    height: Platform.OS === "ios" ? deviceHeight / 5.3 : deviceHeight / 4.72,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  innerCircleStartTransaction: {
    borderRadius: 150,
    borderStyle: "solid",
    width: Platform.OS === "ios" ? deviceWidth / 3 - 5 : deviceWidth / 2.93 - 5,
    height: Platform.OS === "ios" ? deviceHeight / 5.3 - 5 : deviceHeight / 4.72 - 5,
    backgroundColor: "#5CB85C",
    justifyContent: "center",
    alignItems: "center"
  },
  startStopTransactionIcon: {
    fontSize: 70
  },
  innerCircleStopTransaction: {
    borderRadius: 150,
    borderStyle: "solid",
    width: Platform.OS === "ios" ? deviceWidth / 3 - 5 : deviceWidth / 2.93 - 5,
    height: Platform.OS === "ios" ? deviceHeight / 5.3 - 5 : deviceHeight / 4.72 - 5,
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center"
  },
  footerContainer: {
    backgroundColor: "#000000"
  }
});

