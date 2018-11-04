import { Dimensions, Platform, StyleSheet } from 'react-native';
const primary = require("../../theme/variables/commonColor").brandPrimary;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null
  },
  content: {
    flex: 1
  },
  imageHeader: {
    height: 25,
    width: 95,
    resizeMode: "contain"
  },
  spinner: {
    flex: 1
  }
});
