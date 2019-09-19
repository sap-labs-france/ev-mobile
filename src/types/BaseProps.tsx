import NavigationParams from "react-navigation/NavigationParams";
import NavigationScreenProp from "react-navigation/NavigationScreenProp";
import NavigationState from "react-navigation/NavigationState";

export default interface BaseProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}