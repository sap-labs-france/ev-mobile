import { Dimensions, Platform, StyleSheet } from "react-native";
const commonColor = require("../../../theme/variables/commonColor");

const deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  background: {
    flex: 1,
    width: null,
    height: deviceHeight,
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
    color: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    flexGrow: 2
  },
  logo: {
    flex: 1,
    resizeMode: "contain",
    height: deviceHeight / 6,
    alignSelf: "center",
    marginTop: 20
  },
  form: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30
  },
  formErrorText: {
    fontSize: 12,
    color: commonColor.brandDanger,
    textAlign: "right",
    top: -10
  },
  button: {
    marginTop: 7,
    height: 50,
    fontSize: 16
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "900"
  },
  listItemEulaCheckbox : {
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: 5,
    margin: 10
  },
  eulaText: {
    fontSize: 12
  },
  eulaLink: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
  inputGroup: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 15,
    borderWidth: 0,
    borderColor: "transparent"
  },
  input: {
    paddingLeft: 10,
    color: "#fff"
  },
  icon: {
    width: 50,
    color: "#fff"
  }
});
