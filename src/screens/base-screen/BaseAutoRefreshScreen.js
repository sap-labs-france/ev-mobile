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

  async componentWillMount() {
    // Call parent
    await super.componentWillMount();
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Start the timer
    this._startRefreshTimer(true);
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
    // Clear the timer
    this._clearRefreshTimer();
  }

  async componentDidFocus() {
    // Call parent
    await super.componentDidFocus();
    // Start the timer
    this._startRefreshTimer();
  }

  async componentDidBlur() {
    // Call parent
    await super.componentDidBlur();
    // Clear the timer
    this._clearRefreshTimer();
  }

  onBack = () => {
    console.log("REFRESH - MY BACK BUTTON");
    // Not Handled: has to be taken in the sub-classes
    false;
  };

  setActive(active) {
    this.timerRefreshActive = active;
  }

  isActive() {
    return this.timerRefreshActive;
  }

  setRefreshPeriodMillis(refreshPeriodMillis) {
    this.refreshPeriodMillis = refreshPeriodMillis;
  }

  getRefreshPeriodMillis() {
    return this.refreshPeriodMillis;
  }

  // eslint-disable-next-line class-methods-use-this
  refresh() {
    console.log("BaseAutoRefreshScreen: Refresh not implemented!!!");
  }

  _startRefreshTimer(initial = false) {
    // Restart the timer
    if (!this.timerRefresh && this.timerRefreshActive) {
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
