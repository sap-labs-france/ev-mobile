import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import { scale } from 'react-native-size-matters';
import commonColor from "../../theme/variables/commonColor";
import deepmerge from "deepmerge";
import { Platform } from 'react-native';

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
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
    height: scale(150),
    margin: 30
  },
  form: {
    paddingLeft: 15,
    paddingRight: 15
  },
  inputGroup: {
    backgroundColor: "rgba(255,255,255,0.3)",
    height: scale(40),
    marginBottom: 15,
    alignSelf: "center",
    borderWidth: 0,
    borderColor: "transparent"
  },
  inputIcon: {
    marginLeft: scale(5),
    fontSize: scale(14)
  },
  input: {
    height: scale(40),
    fontSize: scale(14),
    marginTop: Platform.OS === "ios" ? scale(-15) : 0
  },
  button: {
    alignSelf: "center",
    marginBottom: 15,
    height: scale(40),
    backgroundColor: "rgba(255,255,255,0.30)"
  },
  buttonText: {
    fontSize: scale(14),
    color: commonColor.textColor
  },
  formErrorText: {
    color: commonColor.brandDanger,
    textAlign: "left",
    top: -5
  },
  eulaContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: 15,
    margin: 5
  },
  eulaCheckbox: {
    margin: scale(10)
  },
  eulaText: { 
    fontSize: scale(12),
    color: commonColor.textColor,
    marginLeft: scale(-10)
  },
  eulaLink: {
    fontSize: scale(12),
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
    ght: "25%",
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
