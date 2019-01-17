import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import Sites from "./screens/Sites";
import SiteAreas from "./screens/SiteAreas";
import Chargers from "./screens/Chargers";
import ChargerDetails from "./screens/Details/ChargerDetails";
import ConnectorDetails from "./screens/Details/ConnectorDetails";
import ChartDetails from "./screens/Details/ChartDetails";
import ChargerTab from "./screens/Details/ChargerTab";
import NotificationScheduler from "./notification/NotificationScheduler";

// Start the monitoring of notifications
new NotificationScheduler().start();

// Charger Tab Navigation
const ChargerTabNavigator = createBottomTabNavigator(
  {
    ConnectorDetails: { screen: ConnectorDetails },
    ChartDetails: { screen: ChartDetails },
    ChargerDetails: { screen: ChargerDetails }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    initialRouteName: "ConnectorDetails",
    animationEnabled: true,
    backBehavior: "none",
    tabBarComponent: (props) => <ChargerTab {...props} />
  }
);

// Drawer Navigation
const AppDrawerNavigator = createDrawerNavigator(
  {
    Sites: { screen: Sites },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerTabNavigator: ChargerTabNavigator
  },
  {
    navigationOptions: {
      swipeEnabled: true,
    },
    drawerWidth: Dimensions.get("window").width / 1.5,
    initialRouteName: "Sites",
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

export default () =>
  <Root>
    <StatusBar hidden/>
    <RootNavigator/>
  </Root>;
