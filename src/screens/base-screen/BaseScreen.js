import { ResponsiveComponent } from "react-native-responsive-ui";
import Constants from "../../utils/Constants";
import { BackHandler } from "react-native";

export default class BaseScreen extends ResponsiveComponent {
  constructor(props) {
    super(props);
    // Add listeners
    this.didFocus = this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.didBlur = this.props.navigation.addListener("didBlur", this.componentDidBlur);
  }

  isMounted() {
    return this.mounted;
  }

  async componentDidMount() {
    this.mounted = true;
    BackHandler.removeEventListener("hardwareBackPress", this.onBack);
  }

  componentWillUnmount() {
    this.mounted = false;
    // Remove listeners
    this.didFocus && this.didFocus.remove();
    this.didBlur && this.didBlur.remove();
  }

  onBack = () => {
    // Not Handled: has to be taken in the sub-classes
    return false;
  };

  componentDidFocus = () => {
    BackHandler.addEventListener("hardwareBackPress", this.onBack);
  };

  componentDidBlur = () => {
  };
}
