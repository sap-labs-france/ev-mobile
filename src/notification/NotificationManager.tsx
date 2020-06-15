import I18n from 'i18n-js';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase/notifications';
import { NavigationActions, NavigationContainerComponent } from 'react-navigation';

import CentralServerProvider from '../provider/CentralServerProvider';
import { UserNotificationType } from '../types/UserNotifications';
import Message from '../utils/Message';
import Utils from '../utils/Utils';

export default class NotificationManager {
  private static instance: NotificationManager;
  private token: string;
  private navigator: NavigationContainerComponent;
  private removeNotificationDisplayedListener: () => any;
  private removeNotificationListener: () => any;
  private removeNotificationOpenedListener: () => any;
  private removeTokenRefreshListener: () => any;
  private messageListener: () => any;
  private centralServerProvider: CentralServerProvider;
  private lastNotification: NotificationOpen

  private constructor() {
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return this.instance;
  }

  public setCentralServerProvider(centralServerProvider: CentralServerProvider) {
    this.centralServerProvider = centralServerProvider;
  }

  public async initialize(navigator: NavigationContainerComponent) {
    // Keep the nav
    this.navigator = navigator;
    // Check if user has given permission
    let enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      // Request permission
      try {
        await firebase.messaging().requestPermission();
        // User has authorized permissions
      } catch (error) {
        // User has rejected permissions
      }
    }
    // Check again
    enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        this.token = fcmToken;
      }
    }
  }

  public async start() {
    // Check Initial Notification
    const initialNotificationOpen = await firebase.notifications().getInitialNotification();
    if (initialNotificationOpen) {
      this.lastNotification = initialNotificationOpen;
    }
    // Notification Displayed
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Do nothing
    });
    // Notification Received
    this.removeNotificationListener = firebase.notifications().onNotification(async (notification: Notification) => {
      // App in foreground: Display the notification
      notification.setSound('default');
      // Check if notification has to be displayed
      if (notification.data) {
        // Check
        switch (notification.data.notificationType) {
          // Do nothing
          case UserNotificationType.END_OF_SESSION:
          case UserNotificationType.SESSION_STARTED:
            break;

          // Force display notif
          default:
            await firebase.notifications().displayNotification(notification);
            break;
        }
      } else {
        // Always display it
        await firebase.notifications().displayNotification(notification);
      }
    });
    // Notification Received and User opened it
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      this.processOpenedNotification(notificationOpen);
    });
    // Get Firebase messages
    this.messageListener = firebase.messaging().onMessage((message) => {
      // Do nothing
    });
    // Token has changed
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
        console.log('Error saving Mobile Token:', error);
      }
    });
  }

  public async stop() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
    this.removeNotificationOpenedListener();
    this.removeTokenRefreshListener();
    this.messageListener();
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

  private async processOpenedNotification(notificationOpen: NotificationOpen): Promise<boolean> {
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
      Message.showError(I18n.t('general.wrongTenant'));
      return false;
    }
    // Check
    switch (notification.data.notificationType) {
      // End of Transaction
      case UserNotificationType.END_OF_SESSION:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'TransactionHistoryNavigator',
            key: `${Utils.randomNumber()}`,
            action: NavigationActions.navigate({
              routeName: 'TransactionDetailsTabs',
              key: `${Utils.randomNumber()}`,
              params: {
                transactionID: parseInt(notification.data.transactionId, 10)
              }
            }),
          })
        );
        break;

      // Session In Progress
      case UserNotificationType.SESSION_STARTED:
      case UserNotificationType.END_OF_CHARGE:
      case UserNotificationType.OPTIMAL_CHARGE_REACHED:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'TransactionInProgressNavigator',
            key: `${Utils.randomNumber()}`,
            action: NavigationActions.navigate({
              routeName: 'ChargerConnectorDetailsTabs',
              key: `${Utils.randomNumber()}`,
              params: {
                chargerID: notification.data.chargeBoxID,
                connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
              }
            }),
          })
        );
        break;

      case UserNotificationType.CHARGING_STATION_STATUS_ERROR:
      case UserNotificationType.PREPARING_SESSION_NOT_STARTED:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'ChargersNavigator',
            key: `${Utils.randomNumber()}`,
            action: NavigationActions.navigate({
              routeName: 'ChargerConnectorDetailsTabs',
              key: `${Utils.randomNumber()}`,
              params: {
                chargerID: notification.data.chargeBoxID,
                connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
              }
            }),
          })
        );
        break;

      // Charger just connected
      case UserNotificationType.SESSION_NOT_STARTED_AFTER_AUTHORIZE:
      case UserNotificationType.CHARGING_STATION_REGISTERED:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'ChargersNavigator',
            key: `${Utils.randomNumber()}`,
            action: NavigationActions.navigate({
              routeName: 'ChargerConnectorDetailsTabs',
              key: `${Utils.randomNumber()}`,
              params: {
                chargerID: notification.data.chargeBoxID,
                connectorID: 1
              }
            }),
          })
        );
        break;

      // Go to Charger list
      case UserNotificationType.OFFLINE_CHARGING_STATION:
        // Navigate
        this.navigator.dispatch(
          NavigationActions.navigate({
            routeName: 'Chargers',
            key: `${Utils.randomNumber()}`
          })
        );
        break;

      // No need to navigate
      case UserNotificationType.UNKNOWN_USER_BADGED:
      case UserNotificationType.OCPI_PATCH_STATUS_ERROR:
      case UserNotificationType.SMTP_AUTH_ERROR:
      case UserNotificationType.USER_ACCOUNT_STATUS_CHANGED:
      case UserNotificationType.USER_ACCOUNT_INACTIVITY:
      case UserNotificationType.BILLING_USER_SYNCHRONIZATION_FAILED:
        break;
    }
    return true;
  }
}
