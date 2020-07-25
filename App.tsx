import React, { useEffect } from 'react';
import { useDarkMode } from 'react-native-dynamic';
import SplashScreen from 'react-native-splash-screen';
import Setup from './src/boot/Setup';

export default function App() {
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
    <Setup />
  )
}
