import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../../theme/variables/commonColor";

export default ({
  padding: {
    top: hp("3%"),
    bottom: hp("12%"),
    left: wp("26%"),
    right: wp("7.6%")
  },
  data: {
    fill: commonColor.textColor,
    fillOpacity: 0.6,
    stroke: commonColor.brandDanger,
    strokeWidth: 3
  },
  xAxisLabel: {
    padding: wp("9.3%"),
    fill: commonColor.textColor,
    fontWeight: "bold",
    fontSize: hp("2.2%")
  },
  yAxisLabel: {
    padding: hp("11.6%"),
    fill: commonColor.textColor,
    fontWeight: "bold",
    fontSize: hp("2.2%")
  }
});
