import { StyleProvider, View } from 'native-base';
import React from 'react';
import { EventSubscription } from 'react-native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import SplashScreen from 'react-native-splash-screen';
import App from './src/App';
import buildTheme from './src/custom-theme';
import ThemeManager from './src/custom-theme/ThemeManager';
import { ThemeType } from './src/types/Theme';

export interface Props {
}

interface State {
  switchTheme?: boolean;
}

export default class AppBootstrap extends React.Component<Props, State> {
  private themeSubscription: EventSubscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      switchTheme: false
    };
  }

  public componentDidMount() {
    // Do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
    // Theme ------------------------------------------------
    const themeManager = ThemeManager.getInstance();
    // Set theme
    themeManager.setThemeType(Appearance.getColorScheme() as ThemeType);
    // Display
    this.setState({switchTheme: true});
    // Subscribe
    this.themeSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Set the new theme
      themeManager.setThemeType(Appearance.getColorScheme() as ThemeType);
      // Refresh
      this.setState({switchTheme: false}, () => this.setState({switchTheme: true}));
    });
  }

  public async componentWillUnmount() {
    if (this.themeSubscription) {
      this.themeSubscription.remove();
    }
  }

  public render() {
    const { switchTheme } = this.state;
    return (
      switchTheme ?
        <AppearanceProvider>
          <StyleProvider style={buildTheme(Appearance.getColorScheme() as ThemeType)}>
            <App/>
          </StyleProvider>
        </AppearanceProvider>
      :
        <View/>
    )
  }
}
