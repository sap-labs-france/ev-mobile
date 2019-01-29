import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import { scale } from "react-native-size-matters";
import commonColor from "../../theme/variables/commonColor";
import deepmerge from "deepmerge";

const commonStyles = {
  noDisplay: {
    flex: 1,
    backgroundColor: "black"
  },
  spinner: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    minHeight: "90%"
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
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
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
    marginTop: scale(20),
    height: scale(100),
  },
  appText: {
    color: commonColor.textColor,
    fontSize: scale(30),
    paddingTop: scale(15),
  },
  appVersionText: {
    color: commonColor.textColor,
    fontSize: scale(15)
  },
  button: {
    width: "90%",
    alignSelf: "center",
    height: scale(40),
    marginTop: scale(10),
    marginBottom: scale(10),
    backgroundColor: "rgba(255,255,255,0.30)"
  },
  buttonText: {
    fontSize: scale(15),
    color: commonColor.textColor
  },
  inputGroup: {
    height: scale(40),
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: scale(10),
    backgroundColor: "rgba(255,255,255,0.20)",
    borderWidth: 0,
    borderColor: "transparent"
  },
  inputIcon: {
    alignSelf: "center",
    textAlign: "center",
    width: "11%",
    fontSize: scale(15)
  },
  inputIconLock: {
    fontSize: scale(20)
  },
  inputField: {
    width: "79%",
    fontSize: scale(15),
    color: commonColor.textColor,
  },
  formErrorText: {
    fontSize: scale(12),
    color: commonColor.brandDanger,
    alignSelf: "flex-start",
    top: scale(-5)
  },
  formErrorTextEula: {
    alignSelf: "center",
    textDecorationLine: "none"
  },
  eulaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 0,
    paddingTop: 0,
    marginBottom: scale(10),
    marginTop: scale(5)
  },
  eulaCheckbox: {
    marginRight: scale(15)
  },
  eulaText: {
    fontSize: scale(13),
    color: commonColor.textColor
  },
  eulaLink: {
    fontSize: scale(13),
    color: commonColor.textColor,
    textDecorationLine: "underline"
  },
  linksButtonLeft: {
    alignSelf: "flex-start"
  },
  linksButtonRight: {
    alignSelf: "flex-end"
  },
  linksTextButton: {
    opacity: 0.9,
    fontSize: scale(12),
    fontWeight: "bold",
    color: commonColor.textColor
  }
};

const portraitStyles = {
};

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
