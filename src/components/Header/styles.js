import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  header: {
    height: scale(40),
    paddingTop: scale(5),
    paddingBottom: scale(5),
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
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
  logoHeader: {
    width: scale(45),
    resizeMode: "contain"
  },
  titleHeader: {
    color: commonColor.textColor,
    fontSize: scale(20),
    width: "75%",
    textAlign: "center",
    fontWeight: "bold"
  },
  titleHeaderWithSubTitle: {
    fontSize: scale(18),
  },
  subTitleHeader: {
    fontWeight: "bold",
    color: commonColor.textColor,
    fontSize: scale(12),
    marginTop: scale(-5)
  },
  iconHeader: {
    fontSize: scale(25)
  },
  leftIconHeader: {
    marginLeft: scale(-5)
  },
  rightIconHeader: {
    marginRight: scale(-5)
  },
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

