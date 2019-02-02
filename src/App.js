import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import Sites from "./screens/Sites";
import SiteAreas from "./screens/SiteAreas";
import Chargers from "./screens/Chargers";
import ChargerTab from "./screens/ChargerDetails/ChargerTab";
import NotificationManager from "./notification/NotificationManager";

// Get the Notification Scheduler
const _notificationManager = NotificationManager.getInstance();
// Initialize
_notificationManager.initialize();

// Drawer Navigation
const AppDrawerNavigator = createDrawerNavigator(
  {
    Sites: { screen: (props) => {
      // Set the navigation to the notification
      _notificationManager.setNavigation(props.navigation);
      // Start
      _notificationManager.start();
      // Return the sites
      return (<Sites {...props} />);
    }},
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerTab: { screen: ChargerTab }
  },
  {
    navigationOptions: {
      swipeEnabled: true,
    },
    drawerWidth: Dimensions.get("window").width / 1.5,
    initialRouteName: "Sites",
    drawerPosition: "right",
    contentComponent: (props) => <Sidebar {...props} />
  }
);

// Stack Navigation
const AuthNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword },
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

const RootNavigator = createSwitchNavigator(
  {
    AuthNavigator: AuthNavigator,
    AppDrawerNavigator: AppDrawerNavigator,
  },
  {
    initialRouteName: "AuthNavigator",
  }
);

export default class App extends React.Component {

  async componentDidMount() {
    // Activate
    _notificationManager.setActive(true);
  }

  async componentWillUnmount() {
    // Deactivate
    this._notificationManager.setActive(false);
  }

  render() {
    return (
      <Root>
        <StatusBar hidden/>
        <RootNavigator/>
      </Root>
    );
  }
}

