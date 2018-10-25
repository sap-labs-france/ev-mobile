import { StyleSheet, Dimensions } from "react-native";

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
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 95
  },
  outerCircle: {
    borderRadius: (deviceWidth / 3 + deviceHeight / 5.3) / 2,
    borderStyle: "solid",
    width: deviceWidth / 3,
    height: deviceHeight / 5.3,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  innerCircleStartTransaction: {
    borderRadius: (deviceWidth / 3 - 5 + deviceHeight / 5.3 - 5) / 2,
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
    borderRadius: (deviceWidth / 3 - 5 + deviceHeight / 5.3 - 5) / 2,
    borderStyle: "solid",
    width: deviceWidth / 3 - 5,
    height: deviceHeight / 5.3 - 5,
    backgroundColor: "#d9534f",
    justifyContent: "center",
    alignItems: "center"
  },
  scrollViewContainer: {
    marginTop: 65
  },
  footerContainer: {
    backgroundColor: "#111111"
  }
});

