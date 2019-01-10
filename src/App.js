import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { createAppContainer, createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import Sites from "./screens/Sites";
import SiteAreas from "./screens/SiteAreas";
import Chargers from "./screens/Chargers";
import ChargerHeader from "./screens/Details/ChargerHeader";
import ChargerNavigator from "./screens/Details/ChargerTab";

// Drawer Menu Navigation
const DrawerNavigator = createDrawerNavigator(
  {
    Sites: { screen: Sites },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerHeader: { screen: ChargerHeader }
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
const AppNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword },
    DrawerNavigator: { screen: DrawerNavigator },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerTab: { screen: ChargerNavigator }
  },
  {
    // index: 0,
    initialRouteName: "Login",
    headerMode: "none"
  }
);

// Create the app
const AppContainer = createAppContainer(AppNavigator);

export default () =>
  <Root>
    <StatusBar hidden/>
    <AppContainer/>
  </Root>;
