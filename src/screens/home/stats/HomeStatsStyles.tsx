import deepmerge from "deepmerge";
import ResponsiveStylesheet from "react-native-responsive-stylesheet"
import { ScaledSheet } from "react-native-size-matters";
import commonColor from "../../../theme/variables/commonColor";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    backgroundColor: commonColor.containerBgColor
  },
  spinner: {
    color: commonColor.textColor
  },
  content: {
    padding: "5@s"
  },
  tabHeader: {},
  cardIcon: {
    textAlign: "center",
    fontSize: "35@s",
    width: "40@s"
  },
  cardText: {
    fontSize: "20@s",
  },
  cardNote: {
    fontStyle: 'italic'
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  dateValue: {
    color: commonColor.textColor
  }
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
