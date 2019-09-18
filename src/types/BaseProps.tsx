import { NavigationScreenProp, NavigationParams, NavigationState } from "react-navigation";

export default interface BaseProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}