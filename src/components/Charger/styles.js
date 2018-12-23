import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';

const commonStyles = {
  container: {
    flex: 1,
    flexDirection: "column",
    padding: "1%",
    marginBottom: scale(10),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15
  },
  chargerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: "1%",
    marginTop: "-1%",
    borderBottomColor: commonColor.textColor,
    borderBottomWidth: 1,
  },
  chargerName: {
    color: commonColor.textColor,
    fontSize: scale(20),
    fontWeight: "bold"
  },
  heartbeatIcon: {
    color: commonColor.brandSuccess,
    fontSize: scale(18)
  },
  deadHeartbeatIcon: {
    color: commonColor.brandDanger,
    fontSize: scale(18)
  },
  connectorsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap"
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
