import { StyleProvider } from "native-base";
import React from "react";
import { Component } from "react";
import App from "../App";
import Theme from "../theme/components";
import variables from "../theme/variables/commonColor";

export default class Setup extends Component {
  public render() {
    return (
      <StyleProvider style={Theme.getTheme(variables)}>
        <App />
      </StyleProvider>
    );
  }
}
