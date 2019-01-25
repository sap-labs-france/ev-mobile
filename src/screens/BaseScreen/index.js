import { ResponsiveComponent } from "react-native-responsive-ui";
import Constants from "../../utils/Constants";

export default class BaseScreen extends ResponsiveComponent {
  constructor(props) {
    super(props);
    // Init
    this.searchText = "";
    this.mounted = false;
    this.timerRefresh = null;
  }

  isMounted() {
    return this.mounted;
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Start the timer
    this._startRefreshTimer(true);
    // Add listeners
    this.props.navigation.addListener("didFocus", this._componentDidFocus);
    this.props.navigation.addListener("didBlur", this._componentDidBlur);
  }

  componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Clear the timer
    this._clearRefreshTimer();
  }

  _componentDidFocus = () => {
    // Start the timer
    this._startRefreshTimer();
  }

  _componentDidBlur = () => {
    // Clear the timer
    this._clearRefreshTimer();
  }

  _startRefreshTimer(initial = false) {
    // Restart the timer
    if (!this.timerRefresh) {
      // Inital load?
      if (!initial) {
        // No: Force Refresh
        this._refresh();
      }
      // Start the timer
      this.timerRefresh = setInterval(() => {
        // Refresh
        this._refreshFromTimer();
      }, Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS);
    }
  }

  _clearRefreshTimer() {
    // Stop the timer
    if (this.timerRefresh) {
      clearInterval(this.timerRefresh);
    }
  }

  _refreshFromTimer = async () => {
    // Component Mounted?
    if (this.mounted) {
      // Refresh
      this._refresh();
    }
  }

  _search(searchText) {
    // Set 
    this.searchText = searchText;
    // Refresh
    this._refresh();
  }

  _refresh() {
    console.log("BaseScreen: Refresh not implemented!!!");
  }
}
