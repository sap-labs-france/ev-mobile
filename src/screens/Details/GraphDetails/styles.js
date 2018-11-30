import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

export default ({
  padding: {
    top: hp("3%"),
    bottom: hp("12%"),
    left: wp("26%"),
    right: wp("7.6%")
  },
  data: {
    fill: "#FFFFFF",
    fillOpacity: 0.6,
    stroke: "#c43a31",
    strokeWidth: 3
  },
  xAxisLabel: {
    padding: wp("9.3%"),
    fill: "#FFFFFF",
    fontWeight: "bold",
    fontSize: hp("2.2%")
  },
  yAxisLabel: {
    padding: hp("11.6%"),
    fill: "#FFFFFF",
    fontWeight: "bold",
    fontSize: hp("2.2%")
  }
});
