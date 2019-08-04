import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColor.containerBgColor
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  topViewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  bottomViewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "10@s"
  },
  spinner: {
    flex: 1,
    color: commonColor.textColor
  },
  descriptionContainer: {
    height: "75@s",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: "20@s",
    fontWeight: "bold",
    color: commonColor.textColor,
    alignSelf: "center"
  },
  value: {
    fontSize: "20@s",
    color: commonColor.textColor
  },
  actionContainer: {
    width: "90%",
    marginTop: "10@s",
    justifyContent: "center"
  },
  actionButton: {
    justifyContent: "center"
  },
  actionButtonText: {
    fontSize: "18@s"
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
