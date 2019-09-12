import React, { Component } from "react";
import { StyleProvider } from "native-base";
import App from "../App";
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

// eslint-disable-next-line react/prefer-stateless-function
export default class Setup extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
        <App />
      </StyleProvider>
    );
  }
}
