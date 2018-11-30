import { StyleSheet, Platform, Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  header: {
    flexDirection: "row",
  },
  arrowIconColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerIcons: {
    fontSize: height > 800 ? hp("2.5%") : hp("5.5"),
    backgroundColor: "transparent",
    color: "#FFFFFF"
  },
  chargerNameColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: wp("66.2%"),
    paddingTop: hp("1%"),
    marginLeft: wp("3.4%")
  },
  chargerName: {
    fontSize: hp("3%"),
    fontWeight: "bold"
  },
  connectorName: {
    fontWeight: "bold",
    fontSize: hp("2%")
  },
  detailsContainer: {
    paddingTop: hp("1.5%")
  },
  backgroundImage: {
    width: wp("100%"),
    height: height > 800 ? hp("29%") : hp("22%")
  },
  spinner: {
    marginTop: hp("18%")
  },
  transactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:  Platform.OS === "ios" ? 95 : 85
  },
  outerCircle: {
    borderRadius: 150,
    borderStyle: "solid",
    width: width > 500 ? wp("30%") : wp("34%"),
    height: height > 800 ? hp("23%") : hp("19%"),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: height > 800 ? hp("7.2%") : hp("0%")
  },
  innerCircleStartTransaction: {
    borderRadius: 150,
    borderStyle: "solid",
    width: width > 500 ? wp("29%") : wp("33%"),
    height: height > 800 ? hp("22%") : hp("18%"),
    backgroundColor: "#5CB85C",
    justifyContent: "center",
    alignItems: "center"
  },
  startStopTransactionIcon: {
    fontSize: hp("10.4%")
  },
  innerCircleStopTransaction: {
    borderRadius: 200,
    borderStyle: "solid",
    width: width > 500 ? wp("29%") : wp("33%"),
    height: height > 800 ? hp("22%") : hp("18%"),
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center"
  },
  footerContainer: {
    backgroundColor: "#000000"
  }
});

