import { StyleProvider } from 'native-base';
import React, { useEffect } from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import SplashScreen from 'react-native-splash-screen';
import App from './src/App';
import Theme from './src/theme/components';
import variables from './src/theme/variables/commonColor';
import { ThemeType } from './src/types/Theme';

export default function AppBootstrap() {
  const colorScheme = useColorScheme() as ThemeType;

  useEffect(() => {
    // Do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }, []);

  return (
    <AppearanceProvider>
      <StyleProvider style={Theme.getTheme(variables)}>
        <App themeType={colorScheme}/>
      </StyleProvider>
    </AppearanceProvider>
  )
}
