import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  leftConnectorContainer: {
    flexDirection: "column",
    borderColor: commonColor.textColor,
    borderRightWidth: 1
  },
  rightConnectorContainer: {
    flexDirection: "column"
  },
  leftStatusConnectorContainer: {
    flexDirection: "row",
    marginTop: hp("0.7%"),
  },
  rightStatusConnectorContainer: {
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
    color: commonColor.textColor,
    textAlign: "center",
    fontSize: hp("3%")
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
  label: {
    color: commonColor.textColor,
    fontSize: hp("1.6%"),
    marginTop: hp("-1%"),
    textAlign: "center"
  },
  subLabel: {
    color: commonColor.textColor,
    fontSize: hp("1.6%"),
    textAlign: "center",
    marginTop: hp("0.1%")
  },
  value: {
    color: commonColor.textColor,
    fontWeight: "bold",
    fontSize: hp("6%"),
    textAlign: "center"
  },
  sizeConnectorImage: {
    height: hp("5.7%"),
    width: wp("9.4%"),
    marginTop: hp("0.3%"),
    marginBottom: hp("0.7%")
  },
  maxPowerContainer: {
    flexDirection: "column"
  }
});
