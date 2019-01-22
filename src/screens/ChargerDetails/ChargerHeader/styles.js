import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  header: {
    height: scale(45),
    paddingTop: scale(10),
    paddingBottom: scale(5),
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3"
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
  logoHeader: {
    width: scale(45),
    resizeMode: "contain"
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

