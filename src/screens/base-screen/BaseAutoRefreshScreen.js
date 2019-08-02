import BaseScreen from "./BaseScreen";
import Constants from "../../utils/Constants";

export default class BaseAutoRefreshScreen extends BaseScreen {
  constructor(props) {
    super(props);
    // Init
    this.searchText = "";
    this.mounted = false;
    this.timerRefresh = null;
    this.timerRefreshActive = true;
    this.refreshPeriodMillis = Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS;
  }

  async componentDidMount() {
    // Call parent
    super.componentDidMount();
    // Start the timer
    this._startRefreshTimer(true);
  }

  componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
    // Clear the timer
    this._clearRefreshTimer();
  }

  componentDidFocus = () => {
    // Call parent
    super.componentDidFocus();
    // Start the timer
    this._startRefreshTimer();
  };

  componentDidBlur = () => {
    // Call parent
    super.componentDidBlur();
    // Clear the timer
    this._clearRefreshTimer();
  };

  setActive(active) {
    this.timerRefreshActive = active;
  }

  // eslint-disable-next-line class-methods-use-this
  refresh() {
    console.log("BaseAutoRefreshScreen: Refresh not implemented!!!");
  }

  _startRefreshTimer(initial = false) {
    // Restart the timer
    if (!this.timerRefresh && this.timerRefreshActive) {
      // Inital load?
      if (!initial) {
        // No: Force Refresh
        this.refresh();
      }
      // Start the timer
      this.timerRefresh = setInterval(() => {
        // Refresh
        this._refreshFromTimer();
      }, this.refreshPeriodMillis);
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
      this.refresh();
    }
  };

  _search(searchText) {
    // Set
    this.searchText = searchText;
    // Refresh
    this.refresh();
  }
}
