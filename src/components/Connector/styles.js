import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';

const commonStyles = {
  statusConnectorContainer: {
    width: "50%"
  },
  leftConnectorContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    borderColor: commonColor.textColor,
    borderRightWidth: 1
  },
  rightConnectorContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%"
  },
  statusDescription: {
    color: commonColor.textColor,
    textAlign: "center",
    padding: scale(5),
    fontSize: scale(20)
  },
  statusConnectorDetailContainer: {
    flexDirection: "row",
    paddingBottom: scale(10),
  },
  statusConnectorDetailLetter: {
    marginTop: scale(-10),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  },
  statusConnectorDetailsContainer: {
    flexGrow: 2
  },
  statusConnectorDetails: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  statusConnectorDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  value: {
    color: commonColor.textColor,
    fontWeight: "bold",
    fontSize: scale(35),
    textAlign: "center"
  },
  sizeConnectorImage: {
    marginTop: scale(6),
    width: scale(35),
    height: scale(35)
  },
  labelImage: {
    color: commonColor.textColor,
    fontSize: scale(12),
    marginTop: scale(3)
  },
  label: {
    color: commonColor.textColor,
    fontSize: scale(12),
    marginTop: scale(-2)
  },
  subLabel: {
    color: commonColor.textColor,
    fontSize: scale(10)
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

