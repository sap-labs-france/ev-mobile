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
  helpBtns: {
    opacity: 0.9,
    fontWeight: "bold",
    color: commonColor.textColor,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    marginTop: -hp("9%")
  },
  logo: {
    resizeMode: "contain",
    height: hp("16.7%"),
    alignSelf: "center"
  },
  form: {
    flex: 1,
    paddingLeft: wp("5.3%"),
    paddingRight: wp("5.3%")
  },
  buttonActionsheet: {
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: wp("70%"),
    height: hp("7%"),
    marginBottom: hp("2.25%"),
    backgroundColor: "rgba(255,255,255,0.30)"
  },
  textActionsheet: {
    color: commonColor.textColor,
    fontSize: hp("2.2%")
  },
  formErrorText: {
    fontSize: hp("2.2%"),
    color: commonColor.brandDanger,
    textAlign: "right",
    top: -hp("1.5%")
  },
  button: {
    marginTop: hp("1.5%"),
    height: hp("7.4%"),
  },
  buttonText: {
    fontSize: hp("2.5%"),
    textAlign: "center",
    fontWeight: "900"
  },
  listItemEulaCheckbox : {
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: hp("0.8%"),
    margin: hp("0.8")
  },
  eulaText: {
    fontSize: hp("2.2%")
  },
  eulaLink: {
    fontSize: hp("2.2%"),
    textDecorationLine: "underline",
  },
  linksContainer: {
    paddingTop: deviceHeight < 600 ? 5 : Platform.OS === "android" ? 10 : 15,
    flexDirection: "row"
  },
  linksButtonLeft: {
    alignSelf: "flex-start"
  },
  linksButtonRight: {
    alignSelf: "flex-end"
  },
  linksButtonCenter: {
    alignSelf: "center"
  },
  helpButton: {
    opacity: 0.9,
    fontWeight: "bold",
    color: commonColor.textColor,
    fontSize: hp("2.2%"),
    height: hp("2.6%")
  },
  inputGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: hp("2%"),
    padding: hp("1%"),
    borderWidth: 0,
    borderColor: "transparent"
  },
  input: {
    color: commonColor.textColor,
    fontSize: hp("2.2%"),
    padding: hp("0%"),
    height: hp("5%")
  },
  icon: {
    width: wp("13.5%"),
    color: commonColor.textColor,
    fontSize: hp("3.7%")
  },
  otherLinkText: {
    alignSelf: "center",
    opacity: 0.8,
    fontSize: hp("2.2%"),
    fontWeight: "bold",
    color: commonColor.textColor
  }
});
