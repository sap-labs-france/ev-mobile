import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../theme/variables/commonColor";
import deepmerge from "deepmerge";
import { ScaledSheet } from "react-native-size-matters";
import { Platform } from "react-native";

const commonStyles = ScaledSheet.create({
  noDisplay: {
    flex: 1,
    backgroundColor: commonColor.brandPrimaryDark
  },
  spinner: {
  },
  container: {
    flex: 1,
    backgroundColor: commonColor.brandPrimaryDark
  },
  keyboardContainer: {
    flex: 1
  },
  scrollContainer: {
    minHeight: "90%"
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  formHeader: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  logo: {
    resizeMode: "contain",
    marginTop: "10@s",
    height: "100@s"
  },
  appText: {
    color: commonColor.inverseTextColor,
    fontSize: "40@s",
    fontWeight: "bold",
    paddingTop: "5@s"
  },
  appVersionText: {
    color: commonColor.inverseTextColor,
    marginTop: "-5@s",
    fontSize: "15@s"
  },
  appTenantName: {
    color: commonColor.inverseTextColor,
    marginTop: "5@s",
    marginBottom: "10@s",
    fontSize: "15@s",
    fontWeight: "bold"
  },
  button: {
    width: "90%",
    alignSelf: "center",
    height: "40@s",
    marginBottom: "10@s",
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  buttonText: {
    width: "100%",
    textAlign: "center",
    fontSize: "15@s",
    color: commonColor.inverseTextColor
  },
  inputGroup: {
    height: "40@s",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: "10@s",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: "0@s",
    borderColor: "transparent"
  },
  inputIcon: {
    color: commonColor.inverseTextColor,
    alignSelf: "center",
    textAlign: "center",
    width: "11%",
    fontSize: Platform.OS === "ios" ? "20@s" : "15@s"
  },
  recaptcha: {
    backgroundColor: "transparent"
  },
  inputIconLock: {
    fontSize: "20@s"
  },
  inputField: {
    width: "79%",
    fontSize: "15@s",
    color: commonColor.inverseTextColor
  },
  formErrorText: {
    fontSize: "12@s",
    marginLeft: 30,
    color: commonColor.brandDanger,
    alignSelf: "flex-start",
    top: "-5@s"
  },
  formErrorTextEula: {
    alignSelf: "center",
    marginLeft: 0,
    textDecorationLine: "none"
  },
  eulaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: "0@s",
    marginBottom: "20@s",
    marginTop: "10@s"
  },
  eulaCheckbox: {
    marginRight: "15@s"
  },
  eulaText: {
    fontSize: "13@s",
    color: commonColor.inverseTextColor
  },
  eulaLink: {
    fontSize: "13@s",
    color: commonColor.inverseTextColor,
    textDecorationLine: "underline"
  },
  linksButtonLeft: {
    alignSelf: "flex-start",
    paddingLeft: 15
  },
  linksButtonRight: {
    alignSelf: "flex-end",
    paddingRight: 15
  },
  linksTextButton: {
    width: "100%",
    opacity: 0.9,
    fontSize: "12@s",
    fontWeight: "bold",
    color: commonColor.inverseTextColor
  },
  linksTextButtonRight: {
    textAlign: "right"
  },
  footer: {
    elevation: 0,
    borderColor: "transparent",
    backgroundColor: "transparent"
  }
});

const portraitStyles = {};

const landscapeStyles = {
  button: {
    width: "65%"
  },
  inputIcon: {
    width: "7%"
  },
  inputField: {
    width: "58%"
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
