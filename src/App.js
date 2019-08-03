import React from "react";
import { StatusBar, Dimensions, AsyncStorage } from "react-native";
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/login/Login";
import Eula from "./screens/auth/eula/Eula";
import RetrievePassword from "./screens/auth/retrieve-password/RetrievePassword";
import SignUp from "./screens/auth/sign-up/SignUp";
import Sidebar from "./screens/sidebar/SideBar";
import Sites from "./screens/sites/Sites";
import SiteAreas from "./screens/site-areas/SiteAreas";
import Chargers from "./screens/chargers/Chargers";
import AllChargers from "./screens/chargers/AllChargers";
import ChargerTabDetails from "./screens/charger-details/tabs/ChargerTabDetails";
import NotificationManager from "./notification/NotificationManager";
import DeviceInfo from "react-native-device-info";
import Utils from "./utils/Utils";
import moment from "moment";

// Get the supported locales
require('moment/locale/fr');
require('moment/locale/en-gb');
// Set the current locale
moment.locale(Utils.getLocaleShort());

// Get the Notification Scheduler
const _notificationManager = NotificationManager.getInstance();
// Initialize
_notificationManager.initialize();

// Drawer Navigation
const AppDrawerNavigator = createDrawerNavigator(
  {
    Sites: {
      screen: props => {
        // Set the navigation to the notification
        _notificationManager.setNavigation(props.navigation);
        // Start
        _notificationManager.start();
        // Return the sites
        return <Sites {...props} />;
      }
    },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    AllChargers: { screen: AllChargers },
    ChargerTabDetails: { screen: ChargerTabDetails }
  },
  {
    navigationOptions: {
      swipeEnabled: true
    },
    drawerWidth: Dimensions.get("window").width / 1.5,
    initialRouteName: "Sites",
    unmountInactiveRoutes: true,
    drawerPosition: "right",
    contentComponent: props => <Sidebar {...props} />
  }
);

// Stack Navigation
const AuthNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

const RootNavigator = createSwitchNavigator(
  {
    AuthNavigator,
    AppDrawerNavigator
  },
  {
    initialRouteName: "AuthNavigator"
  }
);

// Create a container to wrap the main navigator
const RootContainer = createAppContainer(RootNavigator);

// Handle persistence of navigation
const persistenceKey = DeviceInfo.getVersion();
const persistNavigationState = async (navState) => {
  console.log('persistNavigationState');
  try {
    await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState));
  } catch(error) {
    console.log(error);
  }
}
const loadNavigationState = async () => {
  console.log('loadNavigationState');
  const navState = await AsyncStorage.getItem(persistenceKey);
  return JSON.parse(navState);
}
const RootContainerPersists = () => <RootContainer
  persistNavigationState={persistNavigationState}
  loadNavigationState={loadNavigationState}
/>

export default class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  async componentDidMount() {
    // Activate
    _notificationManager.setActive(true);
  }

  async componentWillUnmount() {
    // Deactivate
    this._notificationManager.setActive(false);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Root>
        <StatusBar hidden />
        <RootContainerPersists />
      </Root>
    );
  }
}
