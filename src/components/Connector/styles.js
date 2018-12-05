import { StyleSheet, Platform, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  rightConnectorContainer: {
    flexDirection: "row",
    marginTop: hp("0.7%"),
    borderColor: commonColor.textColor,
    borderRightWidth: 1
  },
  leftConnectorContainer: {
    flexDirection: "row",
    marginTop: hp("0.7%"),
  },
  connectorStatus: {
    flexDirection: "column",
    justifyContent: "center"
  },
  badge: {
    justifyContent: "center",
    borderRadius: 300,
    height: height > 700 ? hp("8.7%") : hp("6.7"),
    width: wp("12%")
  },
  badgeText: {
    fontSize: hp("4.1%"),
    fontWeight: "bold",
    color: commonColor.textColor,
    textAlign: "center",
    textAlignVertical: "center"
  },
  connectorTextInfo: {
    fontSize: hp("1.5%"),
  },
  connectorErrorCodeText: {
    fontSize: hp("1.3"),
    color: commonColor.brandDanger
  },
  status: {
    flexDirection: "column",
    width: wp("30%"),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp("1.3%"),
    marginRight: wp("1.3%")
  },
  statusDetailsContainer: {
    width: wp("32%")
  },
  statusText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Platform.OS === "ios" ? hp("3%") : hp("3.6%")
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
    fontSize: hp("5.2%"),
    textAlign: "center"
  },
  currentConsumptionUnity: {
    marginTop: -hp("0.5"),
    fontSize: hp("1.6%")
  },
  maxEnergy: {
    fontSize: hp("1.6%"),
    textAlign: "center",
    marginTop: hp("0.1%"),
  },
  sizeConnectorImage: {
    height: hp("5.6%"),
    width: wp("9.4%"),
    marginTop: hp("0.7%")
  },
  maxPowerContainer: {
    flexDirection: "column"
  },
  power: {
    fontWeight: "bold",
    fontSize: hp("5.2%"),
    textAlign: "center"
  },
  connectorType: {
    fontSize: hp("1.6%"),
    textAlign: "center"
  }
});
