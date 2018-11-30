import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

export default StyleSheet.create({
  container: {
    paddingBottom: hp("2.3%"),
    marginBottom: hp("3%"),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15
  },
  listDividerContainer: {
    backgroundColor: "transparent",
    paddingBottom: hp("1.1"),
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: wp("0.3%"),
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  chargerName: {
    fontWeight: "bold",
    fontSize: hp("3.6%")
  },
  siteAreaName: {
    fontStyle: "italic",
    fontSize: hp("2.1%")
  },
  heartbeatIcon: {
    color: "#32CD32",
    fontSize: hp("3%")
  },
  deadHeartbeatIcon: {
    color: "#D9534F",
    fontSize: hp("3%")
  },
  listContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    flexWrap: "wrap",
    paddingTop: hp("1.5%")
  }
});
