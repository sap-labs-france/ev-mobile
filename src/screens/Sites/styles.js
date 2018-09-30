import { StyleSheet } from 'react-native';
const primary = require("../../theme/variables/commonColor").brandPrimary;

export default StyleSheet.create({
  bg: {
    backgroundColor: primary
  },
  newsImage: {
    width: 110,
    height: 110
  },
  newsContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  newsHeader: {
    color: "#fff",
    fontWeight: "bold"
  },
  newsLink: {
    color: "#fff",
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    alignSelf: "flex-end"
  },
  newsTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 5
  },
  imageHeader: {
    height: 25,
    width: 95,
    resizeMode: "contain"
  }
});
