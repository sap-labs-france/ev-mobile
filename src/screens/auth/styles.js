import { Dimensions, Platform, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import commonColor from "../../theme/variables/commonColor";

const deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  nodisplay: {
    flex: 1,
    width: null,
    height: hp("100%"),
    backgroundColor: "black"
  },
  background: {
    flex: 1,
    width: null,
    height: hp("100%"),
    backgroundColor: "rgba(0,0,0,0.1)"
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  spinner: {
    flex: 1
  },
  containerLogo: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    flexGrow: 1
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp("-9%")
  },
  logo: {
    resizeMode: "contain",
    height: hp("15%"),
    alignSelf: "center"
  },
  form: {
    flex: 1,
    paddingLeft: wp("5%"),
    paddingRight: wp("5%")
  },
  buttonLocation: {
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: hp("2.25%"),
    backgroundColor: "rgba(255,255,255,0.30)"
  },
  textLocation: {
    color: commonColor.textColor
  },
  inputGroup: {
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: hp("2%"),
    borderWidth: 0,
    borderColor: "transparent"
  },
  icon: {
  },
  input: {
  },
  formErrorText: {
    color: commonColor.brandDanger,
    textAlign: "left",
    top: -hp("1.5%")
  },
  eulaContainer : {
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: hp("0.8%"),
    margin: hp("0.8")
  },
  eulaText: {
    color: commonColor.textColor,
  },
  eulaLink: {
    color: commonColor.textColor,
    textDecorationLine: "underline",
  },
  linksButtonLeft: {
    alignSelf: "flex-start"
  },
  linksButtonRight: {
    alignSelf: "flex-end"
  },
  button: {
    marginTop: hp("1.5%"),
    backgroundColor: "rgba(255,255,255,0.3)"
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "900"
  },
  helpButton: {
    opacity: 0.9,
    fontWeight: "bold",
    color: commonColor.textColor,
    height: hp("3%")
  },
});
