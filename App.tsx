import React from 'react';
import { Appearance, NativeEventSubscription, View } from 'react-native';
import {NativeBaseProvider} from 'native-base';
import App from './src/App';
import ThemeManager from './src/custom-theme/ThemeManager';
import BaseProps from './src/types/BaseProps';
import { ThemeType } from './src/types/Theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export interface Props extends BaseProps {}

interface State {
  switchTheme?: boolean;
}

export default class AppBootstrap extends React.Component<Props, State> {
  private themeSubscription: NativeEventSubscription;

  public constructor(props: Props) {
    super(props);
    this.state = {
      switchTheme: false
    };
  }

  public componentDidMount() {
    // Do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    // Theme ------------------------------------------------
    const themeManager = ThemeManager.getInstance();
    // Set theme
    themeManager.setThemeType(Appearance.getColorScheme() as ThemeType);
    // Display
    this.setState({ switchTheme: true });
    // Subscribe
    this.themeSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Set the new theme
      themeManager.setThemeType(Appearance.getColorScheme() as ThemeType);
      // Refresh
      this.setState({ switchTheme: false }, () => this.setState({ switchTheme: true }));
    });
  }

  public componentWillUnmount() {
    if (this.themeSubscription) {
      this.themeSubscription.remove();
    }
  }

  public render() {
    const { switchTheme } = this.state;
    return switchTheme ? (
      <NativeBaseProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <App />
        </GestureHandlerRootView>
      </NativeBaseProvider>
    ) : (
      <NativeBaseProvider>
        <View />
      </NativeBaseProvider>
    );
  }
}
