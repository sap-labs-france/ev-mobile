import I18n from "i18n-js";
import { Platform } from "react-native";
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase/notifications';
import { NavigationActions, NavigationContainerComponent } from "react-navigation";
import CentralServerProvider from '../provider/CentralServerProvider';
import { UserNotificationType } from "../types/UserNotifications";
import Message from "../utils/Message";
import Utils from "../utils/Utils";


export default class NotificationManager {
  private static notificationManager: NotificationManager;
  private token: string;
  private navigator: NavigationContainerComponent;
  private removeNotificationDisplayedListener: () => any;
  private removeNotificationListener: () => any;
  private removeNotificationOpenedListener: () => any;
  private removeTokenRefreshListener: () => any;
  private centralServerProvider: CentralServerProvider;
  private lastNotification: NotificationOpen

  public static getInstance(): NotificationManager {
    if (!this.notificationManager) {
      this.notificationManager = new NotificationManager();
    }
    return this.notificationManager;
  }

  public setCentralServerProvider(centralServerProvider: CentralServerProvider) {
    this.centralServerProvider = centralServerProvider;
  }

  public async initialize(navigator: NavigationContainerComponent) {
    // Keep the nav
    this.navigator = navigator;
    // Check if user has given permission
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      // Request permission
      try {
        await firebase.messaging().requestPermission();
        // User has authorised
      } catch (error) {
        // User has rejected permissions
      }
    }
  }

  public async start() {
    const initialNotificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (initialNotificationOpen) {
      // Process it later
      this.lastNotification = initialNotificationOpen;
    }
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process notification
      this.processNotification(notification);
    });
    this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process notification
      this.processNotification(notification);
    });
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Process notification
      this.processOpenedNotification(notificationOpen);
    });
    this.removeTokenRefreshListener = firebase.messaging().onTokenRefresh(async (newFcmToken) => {
      // Process your token as required
      this.token = newFcmToken;
      try {
        // Save the User's token
        if (this.centralServerProvider.isUserConnected()) {
          await this.centralServerProvider.saveUserMobileToken({
            id: this.centralServerProvider.getUserInfo().id,
            mobileToken: this.getToken(),
            mobileOS: this.getOs()
          });
        }
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log("Error saving Mobile Token:", error);
      }
    });
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      this.token = fcmToken;
    }
  }

  public async stop() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
    this.removeNotificationOpenedListener();
    this.removeTokenRefreshListener();
  }

  public getToken(): string {
    return this.token;
  }

  public getOs(): string {
    return Platform.OS;
  }

  public async checkOnHoldNotification() {
    if (this.lastNotification) {
      const notificationProcessed = await this.processOpenedNotification(this.lastNotification);
      if (notificationProcessed) {
        this.lastNotification = null;
      }
    }
  }

  public async processNotification(notification: Notification): Promise<boolean> {
    // Do nothing when notification is received but user has not pressed it
    return true;
  }

  public async processOpenedNotification(notificationOpen: NotificationOpen): Promise<boolean> {
    // Get information about the notification that was opened
    const notification: Notification = notificationOpen.notification;
    // No: meaning the user got the notif and clicked on it, then navigate to the right screen
    // User must be logged and Navigation available
    if (!this.centralServerProvider.isUserConnectionValid() || !this.navigator) {
        // Process it later
      this.lastNotification = notificationOpen;
      return false;
    }
    // Check Tenant
    if (this.centralServerProvider.getUserInfo().tenantID !== notification.data.tenantID) {
      Message.showError(I18n.t("general.wrongTenant"));
      return false;
    }
    // Check
    switch (notification.data.notificationType) {
      // End of Transaction
      case UserNotificationType.END_OF_SESSION:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'TransactionDetailsTabsNavigator',
            key: `${Utils.randomNumnber()}`,
            params: {
              transactionID: parseInt(notification.data.transactionID, 10)
            }
          })
        );
        break;

      // Session In Progress
      case UserNotificationType.SESSION_STARTED:
      case UserNotificationType.END_OF_CHARGE:
      case UserNotificationType.OPTIMAL_CHARGE_REACHED:
      case UserNotificationType.CHARGING_STATION_STATUS_ERROR:
      case UserNotificationType.PREPARING_SESSION_NOT_STARTED:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'ChargerDetailsTabsNavigator',
            key: `${Utils.randomNumnber()}`,
            params: {
              chargerID: notification.data.chargeBoxID,
              connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
            }
          })
        );
        break;

      // Charger just connected
      case UserNotificationType.CHARGING_STATION_REGISTERED:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'ChargerDetailsTabsNavigator',
            key: `${Utils.randomNumnber()}`,
            params: {
              chargerID: notification.data.chargeBoxID,
              connectorID: 1
            }
          })
        );
        break;

      // Go to Charger list
      case UserNotificationType.OFFLINE_CHARGING_STATION:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'Chargers',
            key: `${Utils.randomNumnber()}`
          })
        );
        break;

      // No need to navigate
      case UserNotificationType.UNKNOWN_USER_BADGED:
      case UserNotificationType.OCPI_PATCH_STATUS_ERROR:
      case UserNotificationType.SMTP_AUTH_ERROR:
      case UserNotificationType.USER_ACCOUNT_STATUS_CHANGED:
      case UserNotificationType.USER_ACCOUNT_INACTIVITY:
        break;
    }
    return true;
  }
}
