import { Platform } from 'react-native';
import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';

const commonStyles = {
  statusLetter: {
    color: commonColor.textColor,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: scale(27)
  },
  statusGreen: {
    backgroundColor: commonColor.brandSuccess,
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20)
  },
  statusRed: {
    backgroundColor: commonColor.brandDanger,
    width: scale(40),
    height: scale(40),
    borderRadius: 50
  },
  statusOrange: {
    backgroundColor: commonColor.brandWarning,
    width: scale(40),
    height: scale(40),
    borderRadius: 50
  }
};

const portraitStyles = {
};

const landscapeStyles = {
};

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
