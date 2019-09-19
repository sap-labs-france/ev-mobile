import deepmerge from "deepmerge";
import ResponsiveStyleSheet from "react-native-responsive-ui/ResponsiveStyleSheet";
import ScaledSheet from "react-native-size-matters/ScaledSheet";
import commonColor from "../../../theme/variables/commonColor";

const commonStyles = ScaledSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "0@s",
    opacity: 0,
    paddingLeft: "10@s",
    paddingRight: "10@s",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.containerBgColor
  },
  visible: {
    height: "45@s",
    opacity: 1
  },
  hidden: {
    height: "0@s",
    opacity: 0
  },
  inputField: {
    flex: 1,
    paddingLeft: "5@s",
    fontSize: "18@s"
  },
  icon: {
    fontSize: "25@s"
  }
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet() {
  return ResponsiveStyleSheet.select([
    {
      query: { orientation: "landscape" },
      style: deepmerge(commonStyles, landscapeStyles)
    },
    {
      query: { orientation: "portrait" },
      style: deepmerge(commonStyles, portraitStyles)
    }
  ]);
}
