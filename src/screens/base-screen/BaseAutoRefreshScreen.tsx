import BaseScreen from "./BaseScreen";
import Constants from "../../utils/Constants";

export interface Props {
}

interface State {
}

export default class BaseAutoRefreshScreen extends BaseScreen<Props, State> {
  constructor(props: Props) {
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
    await super.componentDidMount();
    // Start the timer
    this._startRefreshTimer();
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
    // Set new interval
    this.refreshPeriodMillis = refreshPeriodMillis;
    // Restart the timer
    this._restartTimer();
  }

  getRefreshPeriodMillis() {
    return this.refreshPeriodMillis;
  }

  // eslint-disable-next-line class-methods-use-this
  refresh() {
    console.log("BaseAutoRefreshScreen: Refresh not implemented!!!");
  }

  _startRefreshTimer() {
    // Start the timer
    if (!this.timerRefresh) {
      this.timerRefresh = setTimeout(() => {
        // Refresh
        if (this.timerRefreshActive) {
          // Component Mounted?
          if (this.mounted) {
            // Execute
            this.refresh();
            // Launch again
            this._restartTimer();
          }
        }
      }, this.refreshPeriodMillis);
    }
  }

  _restartTimer() {
    // Already started
    if (this.timerRefresh) {
      // Clear the timer
      this._clearRefreshTimer();
      // Start the timer
      this._startRefreshTimer();
    }
  }

  _clearRefreshTimer() {
    // Stop the timer
    if (this.timerRefresh) {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = null;
    }
  }

  _search(searchText) {
    // Set
    this.searchText = searchText;
    // Refresh
    this.refresh();
  }
}
