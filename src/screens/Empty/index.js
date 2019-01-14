import React from "react";
import { Spinner } from "native-base";
import { StyleSheet } from "react-native";
import commonColor from "../../theme/variables/commonColor";

const style = StyleSheet.create({
  spinner: {
    flex: 1,
    backgroundColor: "black"
  }
});

class Empty extends React.Component {
  render() {
    return (
      <Spinner style={style.spinner} color="white"/>
    );
  }
}

export default Empty;


