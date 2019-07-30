import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import deepmerge from "deepmerge";
import commonColor from "../../../theme/variables/commonColor";
import { ScaledSheet } from "react-native-size-matters";

const commonStyles = ScaledSheet.create({
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
    borderColor: commonColor.textColorApp,
    borderRightWidth: 1
  },
  rightConnectorContainer: {},
  statusDescription: {
    color: commonColor.textColorApp,
    paddingTop: "5@s",
    fontSize: "18@s"
  },
  statusOneDescription: {
    fontSize: "22@s"
  },
  statusConnectorDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingLeft: "5@s",
    paddingRight: "5@s",
    paddingBottom: "15@s"
  },
  statusOneConnectorDetailContainer: {
    marginTop: "-10@s",
    padding: "0@s"
  },
  statusConnectorDescriptionContainer: {
    paddingBottom: "5@s"
  },
  leftStatusConnectorDetailContainer: {
    paddingRight: "5@s"
  },
  rightStatusConnectorDetailContainer: {
    paddingLeft: "5@s"
  },
  statusConnectorDetail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "60@s",
    width: "60@s"
  },
  statusConnectorDetailLetter: {
    marginTop: "-10@s"
  },
  animatableValue: {
    position: "absolute",
    alignItems: "center"
  },
  value: {
    color: commonColor.textColorApp,
    fontWeight: "bold",
    marginTop: "-1@s",
    fontSize: "30@s",
    textAlign: "center"
  },
  connectorImage: {
    width: "40@s",
    height: "40@s"
  },
  labelImage: {
    color: commonColor.textColorApp,
    fontSize: "10@s"
  },
  label: {
    color: commonColor.textColorApp,
    fontSize: "10@s",
    marginTop: "-3@s"
  },
  subLabel: {
    color: commonColor.textColorApp,
    fontSize: "9@s"
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
