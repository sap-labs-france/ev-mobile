import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { scale } from "react-native-size-matters";

const commonStyles = {
  statusConnectorContainer: {
    width: "50%"
  },
  statusOneConnectorContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch"
  },
  connectorContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%"
  },
  leftConnectorContainer: {
    borderColor: commonColor.textColor,
    borderRightWidth: 1
  },
  rightConnectorContainer: {
  },
  statusDescription: {
    color: commonColor.textColor,
    paddingTop: scale(5),
    fontSize: scale(18),
  },
  statusOneDescription: {
    fontSize: scale(22),
  },
  statusConnectorDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingLeft: scale(5),
    paddingRight: scale(5),
    paddingBottom: scale(15),
  },
  statusOneConnectorDetailContainer: {
    marginTop: scale(-5),
    padding: 0
  },
  statusConnectorDescriptionContainer: {
    paddingBottom: scale(5),
  },
  leftStatusConnectorDetailContainer: {
    paddingRight: scale(5)
  },
  rightStatusConnectorDetailContainer: {
    paddingLeft: scale(5)
  },
  statusConnectorDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: scale(60),
    width: scale(60)
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
    width: scale(40),
    height: scale(40),
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

