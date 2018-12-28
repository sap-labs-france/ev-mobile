import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import Sites from "./screens/Sites";
import Chargers from "./screens/Chargers";
import ChargerHeader from "./screens/Details/ChargerHeader";
import ChargerNavigation from "./screens/Details/ChargerTab";

// Drawer Menu Navigation
const DrawerNavigation = createDrawerNavigator(
  {
    Sites: { screen: Sites },
    Chargers: { screen: Chargers },
    ChargerHeader: { screen: ChargerHeader }
  },
  {
    navigationOptions: {
      swipeEnabled: true,
    },
    drawerWidth: Dimensions.get("window").width / 1.6,
    initialRouteName: "Sites",
    drawerPosition: "right",
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
    Chargers: { screen: Chargers },
    Charger: { screen: ChargerNavigation }
  },
  {
    index: 0,
    initialRouteName: "Login",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <StatusBar hidden/>
    <AppNavigation/>
  </Root>;
