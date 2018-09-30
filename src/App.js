import React from "react";
import { StatusBar } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import Sites from "./screens/Sites";
import SiteAreas from "./screens/SiteAreas";

// Drawer Menu Navigation
const DrawerNavigation = DrawerNavigator(
  {
    Sites: { screen: Sites },
    SiteAreas: { screen: SiteAreas }
  },
  {
    initialRouteName: "SiteAreas",
    contentComponent: props => <Sidebar {...props} />
  }
);

// Stack Navigation
const AppNavigation = StackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword },
    DrawerNavigation: { screen: DrawerNavigation }
  },
  {
    index: 0,
    initialRouteName: "DrawerNavigation",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <StatusBar hidden />
    <AppNavigation />
  </Root>;
