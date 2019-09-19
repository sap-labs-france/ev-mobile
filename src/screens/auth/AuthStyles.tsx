import deepmerge from "deepmerge";
import ResponsiveStyleSheet from "react-native-responsive-ui/ResponsiveStyleSheet";
import ScaledSheet from "react-native-size-matters/ScaledSheet";
import Platform from "react-native/Platform";
import commonColor from "../../../theme/variables/commonColor";

const commonStyles = ScaledSheet.create({
  noDisplay: {
    flex: 1,
    backgroundColor: commonColor.brandPrimaryDark
  },
  spinner: {
    flex: 1
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
    backgroundColor: commonColor.buttonBg
  },
  buttonText: {
    width: "100%",
    textAlign: "center",
    fontSize: "15@s",
    color: commonColor.inverseTextColor
  },
  inputGroup: {
    height: "40@s",
    borderRadius: "20@s",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: "10@s",
    backgroundColor: commonColor.inputGroupBg,
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
    color: commonColor.brandDangerLight,
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
  linksButton: {},
  linksButtonLeft: {
    alignSelf: "flex-start",
    marginLeft: "15@s"
  },
  linksButtonRight: {
    alignSelf: "flex-end",
    marginRight: "15@s"
  },
  linksTextButton: {
    fontSize: "12@s",
    fontWeight: "bold",
    paddingBottom: "15@s",
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
