import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';

const commonStyles = {
  header: {
    height: scale(40)
  },
  leftHeader: {
    flex: 0
  },
  bodyHeader: {
    flex: 1
  },
  rightHeader: {
    flex: 0
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: scale(15),
    fontWeight: "bold"
  },
  subTitleHeader: {
    fontWeight: "bold",
    color: commonColor.textColor,
    fontSize: scale(10),
    marginTop: scale(-2)
  },
  iconHeader: {
    fontSize: scale(25)
  },
  detailsContainer: {
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

