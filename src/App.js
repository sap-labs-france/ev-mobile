import React from "react";
import { StatusBar } from "react-native";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import Sites from "./screens/Sites";
import Chargers from "./screens/Chargers";
import ConnectorDetails from "./screens/ConnectorDetails";

// Drawer Menu Navigation
const DrawerNavigation = createDrawerNavigator(
  {
    Sites: { screen: Sites },
    Chargers: { screen: Chargers }
  },
  {
    initialRouteName: "Sites",
    contentComponent: props => <Sidebar {...props} />
  }
);

// Stack Navigation
const AppNavigation = createStackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword },
    DrawerNavigation: { screen: DrawerNavigation },
    ConnectorDetails: { screen: ConnectorDetails }
  },
  {
    index: 0,
    initialRouteName: "Login",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <StatusBar hidden />
    <AppNavigation />
  </Root>;
