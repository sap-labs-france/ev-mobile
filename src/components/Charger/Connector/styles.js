import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  statusLeftRightConnectorContainer: {
    width: "50%"
  },
  statusConnectorContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch"
  },
  connectorContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  leftConnectorContainer: {
    borderColor: commonColor.textColor,
    borderRightWidth: 1
  },
  rightConnectorContainer: {
  },
  statusDescription: {
    color: commonColor.textColor,
    textAlign: "center",
    paddingTop: scale(5),
    fontSize: scale(18)
  },
  statusConnectorDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: scale(10),
    paddingLeft: scale(10),
    paddingRight: scale(10)
  },
  leftStatusConnectorDetailContainer: {
    paddingRight: scale(10)
  },
  rightStatusConnectorDetailContainer: {
    paddingLeft: scale(10)
  },
  statusConnectorDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: scale(60)
  },
  statusConnectorDetailLetter: {
    marginTop: scale(-10),
  },
  animatableValue: {
    position: "absolute",
    alignItems: "center"
  },
  value: {
    color: commonColor.textColor,
    fontWeight: "bold",
    marginTop: scale(-1),
    fontSize: scale(30),
    textAlign: "center"
  },
  connectorImage: {
    marginTop: scale(6),
    width: scale(30),
    height: scale(30)
  },
  labelImage: {
    color: commonColor.textColor,
    fontSize: scale(10),
  },
  label: {
    color: commonColor.textColor,
    fontSize: scale(10),
    marginTop: scale(-3),
  },
  subLabel: {
    color: commonColor.textColor,
    fontSize: scale(9)
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

