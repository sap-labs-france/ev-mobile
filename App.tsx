/**
 * eMobility React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import Setup from "./src/boot/Setup";
import SplashScreen from "react-native-splash-screen";

export default class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    // Do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }
  // eslint-disable-next-line class-methods-use-this
  render() {
    return <Setup />;
  }
}
