import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  chargerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: "5@s",
    borderBottomColor: commonColor.textColor,
    borderBottomWidth: 1
  },
  name: {
    color: commonColor.textColor,
    fontSize: "20@s",
    marginLeft: "5@s",
    fontWeight: "bold"
  },
  heartbeatIcon: {
    color: commonColor.brandSuccess,
    fontSize: "18@s"
  },
  deadHeartbeatIcon: {
    color: commonColor.brandDanger,
    fontSize: "18@s"
  },
  connectorsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap"
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
