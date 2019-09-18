import BaseScreen from "./BaseScreen";
import Constants from "../../utils/Constants";
import BaseProps from "../../types/BaseProps";

export interface Props extends BaseProps {
}

export default class BaseAutoRefreshScreen extends BaseScreen {
  private timerRefresh: ReturnType<typeof setTimeout>;
  private timerRefreshActive: boolean;
  private refreshPeriodMillis: number;

  constructor(props: Props) {
    super(props);
    // Init
    this.timerRefresh = null;
    this.timerRefreshActive = true;
    this.refreshPeriodMillis = Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS;
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Start the timer
    this._startRefreshTimer();
  }

  public async componentWillUnmount() {
    await super.componentWillUnmount();
    // Clear the timer
    this._clearRefreshTimer();
  }

  public async componentDidFocus() {
    await super.componentDidFocus();
    // Start the timer
    this._startRefreshTimer();
  }

  public async componentDidBlur() {
    await super.componentDidBlur();
    // Clear the timer
    this._clearRefreshTimer();
  }

  public onBack = (): boolean => {
    // Not Handled: has to be taken in the sub-classes
    return false;
  }

  public setActive(active: boolean) {
    this.timerRefreshActive = active;
  }

  public isActive(): boolean {
    return this.timerRefreshActive;
  }

  public setRefreshPeriodMillis(refreshPeriodMillis: number) {
    // Set new interval
    this.refreshPeriodMillis = refreshPeriodMillis;
    // Restart the timer
    this._restartTimer();
  }

  public getRefreshPeriodMillis(): number {
    return this.refreshPeriodMillis;
  }

  public refresh() {
    console.log("BaseAutoRefreshScreen: Refresh not implemented!!!");
  }

  private _startRefreshTimer() {
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

  private _restartTimer() {
    // Already started
    if (this.timerRefresh) {
      // Clear the timer
      this._clearRefreshTimer();
      // Start the timer
      this._startRefreshTimer();
    }
  }

  private _clearRefreshTimer() {
    // Stop the timer
    if (this.timerRefresh) {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = null;
    }
  }
}
