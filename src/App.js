import React from "react";
import { StatusBar } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";

// Drawer Menu Navigation
const Drawer = DrawerNavigator(
  {
    SignUp: { screen: SignUp }
  },
  {
    initialRouteName: "SignUp",
    contentComponent: props => <Sidebar {...props} />
  }
);

// Stack Navigation
const App = StackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword },
    Drawer: { screen: Drawer }
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
    <App />
  </Root>;
