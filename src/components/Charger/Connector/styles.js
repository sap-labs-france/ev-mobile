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
    textAlign: "center",
    paddingTop: scale(5),
    fontSize: scale(20)
  },
  statusConnectorDetailContainer: {
    flexDirection: "row",
    paddingBottom: scale(5)
  },
  statusConnectorDetailLetter: {
    marginTop: scale(-10),
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1
  },
  leftStatusConnectorDetailLetter: {
    alignItems: "flex-start"
  },
  rightStatusConnectorDetailLetter: {
    alignItems: "flex-end"
  },
  statusConnectorDetailsContainer: {
    flexGrow: 2
  },
  leftStatusConnectorDetailsContainer: {
    paddingRight: scale(5)
  },
  rightStatusConnectorDetailsContainer: {
    paddingLeft: scale(5)
  },
  statusConnectorDetails: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: scale(65)
  },
  statusConnectorDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: scale(55)
  },
  animatableValue: {
    position: "absolute",
    alignItems: "center"
  },
  value: {
    color: commonColor.textColor,
    fontWeight: "bold",
    marginTop: scale(3),
    fontSize: scale(28),
    textAlign: "center"
  },
  sizeConnectorImage: {
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
  statusConnectorDetailsStandalone: {
    marginLeft: scale(-10)
  }
};

const landscapeStyles = {
  statusConnectorDetailsStandalone: {
    marginLeft: scale(-50)
  }
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

