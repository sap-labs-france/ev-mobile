import React from 'react';
import SplashScreen from 'react-native-splash-screen';

import Setup from './src/boot/Setup';

export default class App extends React.Component {
  public componentDidMount() {
    // Do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }
  public render() {
    return <Setup />;
  }
}
