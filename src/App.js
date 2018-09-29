// @flow
import React from "react";
import { StatusBar } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/auth/Login";
import Eula from "./screens/auth/Eula/";
import RetrievePassword from "./screens/auth/RetrievePassword";
import SignUp from "./screens/auth/SignUp";
import Sidebar from "./screens/Sidebar";
import I18n from "./I18n/I18n";

// Translate error message
const errorMessages = {
  en: {
    "numbers": I18n.t("general.numbers"),
    "email": I18n.t("general.email", {locale:"en"}),
    "required": I18n.t("general.required", {locale:"en"}),
    "date": I18n.t("general.date", {locale:"en"}),
    "minlength": I18n.t("general.minlength", {locale:"en"}),
    "maxlength": I18n.t("general.maxlength", {locale:"en"})
  },
  fr: {
    "numbers": I18n.t("general.numbers", {locale:"fr"}),
    "email": I18n.t("general.email", {locale:"fr"}),
    "required": I18n.t("general.required", {locale:"fr"}),
    "date": I18n.t("general.date", {locale:"fr"}),
    "minlength": I18n.t("general.minlength", {locale:"fr"}),
    "maxlength": I18n.t("general.maxlength", {locale:"fr"})
  }
};

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
    Login: { screen: props => <Login {...props} deviceLocale="en" messages={errorMessages}/> },
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
