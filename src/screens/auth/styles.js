import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import { scale } from "react-native-size-matters";
import commonColor from "../../theme/variables/commonColor";
import deepmerge from "deepmerge";

const commonStyles = {
  nodisplay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.1)"
  },
  content: {
    height: "100%",
    width: "100%"
  },
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "stretch"
  },
  logoContainer: {
    flex:1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "center"
  },
  appText: {
    color: commonColor.textColor,
    fontSize: scale(25),
    paddingTop: scale(15),
  },
  versionText: {
    color: commonColor.textColor,
    fontSize: scale(13),
  },
  versionDate: {
    color: commonColor.textColor,
    fontSize: scale(11)
  },
  form: {
    paddingLeft: scale(15),
    paddingRight: scale(15),
    height: scale(300)
  },
  inputGroup: {
    backgroundColor: "rgba(255,255,255,0.3)",
    height: scale(40),
    marginBottom: scale(10),
    alignSelf: "center",
    borderWidth: 0,
    borderColor: "transparent"
  },
  inputIconMail: {
    alignSelf: "center",
    width: scale(35),
    marginTop: scale(2),
    marginLeft: scale(5),
    marginRight: scale(5),
    fontSize: scale(20)
  },
  inputIconPassword: {
    alignSelf: "center",
    width: scale(35),
    marginLeft: scale(8),
    marginRight: scale(5),
    fontSize: scale(20)
  },
  inputField: {
    width: "100%",
    fontSize: scale(15),
    color: commonColor.textColor,
  },
  button: {
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
  formErrorText: {
    fontSize: scale(12),
    color: commonColor.brandDanger,
    textAlign: "left",
    top: scale(-5)
  },
  eulaContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
    borderBottomWidth: 0,
    paddingTop: 0,
    marginBottom: scale(10),
    marginTop: scale(5)
  },
  eulaCheckbox: {
    marginRight: scale(15)
  },
  eulaText: {
    alignSelf: "flex-start",
    fontSize: scale(13),
    color: commonColor.textColor
  },
  eulaLink: {
    fontSize: scale(13),
    color: commonColor.textColor,
    textDecorationLine: "underline"
  },
  spinner: {
    color: commonColor.brandDanger
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
  logo: {
    height: "25%",
    width: "50%"
  },
  formErrorText: {
    marginLeft: "5%"
  },
  eulaContainer: {
    width: "95%"
  },
  button: {
    width: "95%"
  },
  inputGroup: {
    width: "95%"
  }
};

const landscapeStyles = {
  logo: {
    height: "15%",
    width: "25%"
  },
  formErrorText: {
    marginLeft: "18%"
  },
  eulaContainer: {
    width: "65%"
  },
  button: {
    width: "65%"
  },
  inputGroup: {
    width: "65%"
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
