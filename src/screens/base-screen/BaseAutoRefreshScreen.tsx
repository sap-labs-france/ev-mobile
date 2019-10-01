import BaseProps from '../../types/BaseProps';
import Constants from '../../utils/Constants';
import BaseScreen from './BaseScreen';

export interface Props extends BaseProps {
}

interface State {
}

export default class BaseAutoRefreshScreen<P, S> extends BaseScreen<Props, State> {
  private timerRefresh: ReturnType<typeof setTimeout>;
  private timerRefreshActive: boolean;
  private refreshOngoing: boolean = false;
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
    this.clearRefreshTimer();
  }

  public async componentDidFocus() {
    await super.componentDidFocus();
    // Start the timer
    this._startRefreshTimer();
  }

  public async componentDidBlur() {
    await super.componentDidBlur();
    // Clear the timer
    this.clearRefreshTimer();
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
    this.restartTimer();
  }

  public getRefreshPeriodMillis(): number {
    return this.refreshPeriodMillis;
  }

  public async refresh() {
    // tslint:disable-next-line: no-console
    console.log('BaseAutoRefreshScreen: Refresh not implemented!!!');
  }

  private _startRefreshTimer() {
    // Start the timer
    if (!this.timerRefresh) {
      this.timerRefresh = setTimeout(async () => {
        // Refresh
        if (this.timerRefreshActive && !this.refreshOngoing) {
          // Start (necessary for the simulators)
          this.refreshOngoing = true;
          // Component Mounted?
          if (this.mounted) {
            try {
              // Execute
              await this.refresh();
            } catch (error) {
              // Ignore
            }
          }
          // Restart
          this.restartTimer();
          // End
          this.refreshOngoing = false;
        }
      }, this.refreshPeriodMillis);
    }
  }

  private restartTimer = () => {
    // Already started
    if (this.timerRefresh) {
      // Clear the timer
      this.clearRefreshTimer();
      // Start the timer
      this._startRefreshTimer();
    }
  }

  private clearRefreshTimer = () => {
    // Stop the timer
    if (this.timerRefresh) {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = null;
    }
  }
}
