import { ResponsiveComponent } from "react-native-responsive-ui";
import { BackHandler } from "react-native";
import ProviderFactory from "../../provider/ProviderFactory";

export default class BaseScreen extends ResponsiveComponent {
  constructor(props) {
    super(props);
    // Add listeners
    this.didFocus = this.props.navigation.addListener("didFocus", this.componentDidFocus.bind(this));
    this.didBlur = this.props.navigation.addListener("didBlur", this.componentDidBlur.bind(this));
  }

  isMounted() {
    return this.mounted;
  }

  async componentDidMount() {
    this.mounted = true;
    this.centralServerProvider = await ProviderFactory.getProvider();
    BackHandler.removeEventListener("hardwareBackPress", this.onBack);
  }

  async componentWillUnmount() {
    this.mounted = false;
    // Remove listeners
    this.didFocus && this.didFocus.remove();
    this.didBlur && this.didBlur.remove();
  }

  onBack() {
    // Not Handled: has to be taken in the sub-classes
    return false;
  }

  async componentDidFocus() {
    BackHandler.addEventListener("hardwareBackPress", this.onBack.bind(this));
  }

  async componentDidBlur() {}
}
