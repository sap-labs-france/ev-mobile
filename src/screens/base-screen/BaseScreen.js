import { ResponsiveComponent } from "react-native-responsive-ui";
import Constants from "../../utils/Constants";

export default class BaseScreen extends ResponsiveComponent {
  constructor(props) {
    super(props);
  }

  isMounted() {
    return this.mounted;
  }

  async componentDidMount() {
    this.mounted = true;
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidFocus = () => {
  };

  componentDidBlur = () => {
  };
}
