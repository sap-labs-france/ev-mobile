import moment from 'moment';

import BaseProps from '../../types/BaseProps';
import Constants from '../../utils/Constants';
import BaseScreen from './BaseScreen';

export interface Props extends BaseProps {}

interface State {}

export default class BaseAutoRefreshScreen<P, S> extends BaseScreen<Props, State> {
  private timerRefresh: ReturnType<typeof setTimeout>;
  private timerRefreshActive: boolean;
  private refreshOngoing = false;
  protected refreshPeriodMillis: number;
  private lastRefreshDate: Date;

  public constructor(props: Props) {
    super(props);
    // Init
    this.timerRefresh = null;
    this.timerRefreshActive = true;
    this.refreshPeriodMillis = Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS;
  }

  public async componentDidMount(triggerRefresh = false) {
    await super.componentDidMount();
    // Refresh
    if (this.props.navigation.isFocused() && this.canRefresh()) {
      // Refresh
      if (triggerRefresh) {
        await this.refresh();
      }
      this.lastRefreshDate = new Date();
    }
    // Start the timer
    this.startRefreshTimer();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    // Clear the timer
    this.clearRefreshTimer();
  }

  public componentDidFocus(): void {
    super.componentDidFocus();
    // Refresh
    if (this.isMounted() && this.props.navigation.isFocused() && this.canRefresh()) {
      this.refresh();
      this.lastRefreshDate = new Date();
    }
    // Start the timer
    this.startRefreshTimer();
  }

  public componentDidBlur(): void {
    super.componentDidBlur();
    // Clear the timer
    this.clearRefreshTimer();
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
    console.warn('BaseAutoRefreshScreen: Refresh not implemented!!!');
  }

  protected async manualRefresh()  {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  private canRefresh(): boolean {
    if (!this.lastRefreshDate) {
      return true;
    }
    return moment().diff(this.lastRefreshDate) > Constants.AUTO_REFRESH_DUPS_INTERVAL;
  }

  private startRefreshTimer() {
    // Start the timer
    if (!this.timerRefresh) {
      // Timer
      this.timerRefresh = setTimeout(async () => {
        // Refresh
        if (this.timerRefreshActive && !this.refreshOngoing) {
          // Start (necessary for the simulators)
          this.refreshOngoing = true;
          // Component Mounted?
          if (this.mounted) {
            try {
              if (this.props.navigation.isFocused()) {
                // Already refreshed?
                if (this.canRefresh()) {
                  // No: Refresh
                  await this.refresh();
                  this.lastRefreshDate = new Date();
                }
              } else {
                // Stop the timer
                this.clearRefreshTimer();
              }
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
      this.startRefreshTimer();
    }
  };

  private clearRefreshTimer = () => {
    // Stop the timer
    if (this.timerRefresh) {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = null;
    }
  };
}
