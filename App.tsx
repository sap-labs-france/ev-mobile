import { StyleProvider } from 'native-base';
import React, { useEffect } from 'react';
import { useDarkMode } from 'react-native-dynamic';
import SplashScreen from 'react-native-splash-screen';
import App from './src/App';
import Theme from './src/theme/components';
import variables from './src/theme/variables/commonColor';

export default function AppBootstrap() {
  const isDarkMode = useDarkMode();

  useEffect(() => {
    // Do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
    console.log('====================================');
    console.log(isDarkMode);
    console.log('====================================');
  }, []);

  return (
    <StyleProvider style={Theme.getTheme(variables)}>
      <App />
    </StyleProvider>
  )
}
