/**
 * eMobility React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import Setup from "./src/boot/setup";

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <Setup />;
  }
}
