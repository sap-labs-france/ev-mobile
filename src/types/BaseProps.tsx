import React from "react";
import { NavigationParams } from "react-navigation";
import { NavigationScreenProp } from "react-navigation";
import { NavigationState } from "react-navigation";

export default interface BaseProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  children?: React.ReactNode;
  key?: string;
}