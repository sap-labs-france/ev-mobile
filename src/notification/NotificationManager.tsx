import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase/notifications';

import CentralServerProvider from '../provider/CentralServerProvider';
import { UserNotificationType } from '../types/UserNotifications';
import Message from '../utils/Message';
import SecuredStorage from '../utils/SecuredStorage';
import Utils from '../utils/Utils';

export default class NotificationManager {
  private static instance: NotificationManager;
  private token: string;
  private navigator: NavigationContainerRef;
  private removeNotificationDisplayedListener: () => any;
  private removeNotificationListener: () => any;
  private removeNotificationOpenedListener: () => any;
  private removeTokenRefreshListener: () => any;
  private messageListener: () => any;
  private centralServerProvider: CentralServerProvider;
  private lastNotification: NotificationOpen;

  private constructor() {
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public setCentralServerProvider(centralServerProvider: CentralServerProvider) {
    this.centralServerProvider = centralServerProvider;
  }

  public async initialize(navigator: NavigationContainerRef) {
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
          // Display notif
          default:
            if (Object.values(UserNotificationType).includes(notification.data.notificationType as UserNotificationType)) {
              await firebase.notifications().displayNotification(notification);
            }
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
    let connectionIsValid = true;
    // Not valid
    if (!notificationOpen?.notification?.data) {
      return true;
    }
    // Get information about the notification that was opened
    const notification: Notification = notificationOpen.notification;
    // User must be logged and Navigation available
    if (!this.navigator || !this.centralServerProvider) {
      // Process later
      this.lastNotification = notificationOpen;
      return false;
    }
    // Check tenant
    if (!notification.data.tenantSubdomain) {
      Message.showError(I18n.t('general.tenantMissing'));
      return false;
    }
    // Check if tenant exists
    const tenant = await this.centralServerProvider.getTenant(notification.data.tenantSubdomain);
    if (!tenant) {
      Message.showError(I18n.t('general.tenantUnknown', { tenantSubdomain: notification.data.tenantSubdomain }));
      return false;
    }
    // Check current connection
    if (!this.centralServerProvider.isUserConnectionValid()) {
      connectionIsValid = false;
    // Check current Tenant
    } else if (this.centralServerProvider.getUserInfo().tenantSubdomain !== tenant.subdomain) {
      connectionIsValid = false;
    }
    // Establish connection
    if (!connectionIsValid) {
      // Try to login
      const userCredentials = await SecuredStorage.getUserCredentials(tenant.subdomain);
      if (userCredentials) {
        // Login
        try {
          await this.centralServerProvider.login(
            userCredentials.email, userCredentials.password, true, userCredentials.tenantSubDomain);
        } catch (error) {
          // Cannot login
          Message.showError(I18n.t('general.mustLoggedToTenant', { tenantName: tenant.name }));
          return false;
        }
      } else {
        // Cannot login
        Message.showError(I18n.t('general.mustLoggedToTenant', { tenantName: tenant.name }));
        return false;
      }
    }
    // Check
    switch (notification.data.notificationType) {
    // End of Transaction
      case UserNotificationType.END_OF_SESSION:
        this.navigator.dispatch(
          StackActions.replace(
            'AppDrawerNavigator',
            {
              screen: 'TransactionHistoryNavigator',
              initial: false,
              params: {
                screen: 'TransactionDetailsTabs',
                key: `${Utils.randomNumber()}`,
                params: {
                  params: {
                    transactionID: Utils.convertToInt(notification.data.transactionId)
                  }
                }
              }
            }
          ),
        );
        break;
      // Session In Progress
      case UserNotificationType.SESSION_STARTED:
      case UserNotificationType.END_OF_CHARGE:
      case UserNotificationType.OPTIMAL_CHARGE_REACHED:
        this.navigator.dispatch(
          StackActions.replace(
            'AppDrawerNavigator',
            {
              screen: 'TransactionInProgressNavigator',
              initial: false,
              params: {
                screen: 'ChargingStationConnectorDetailsTabs',
                key: `${Utils.randomNumber()}`,
                params: {
                  params: {
                    chargingStationID: notification.data.chargeBoxID,
                    connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
                  }
                }
              }
            }
          ),
        );
        break;
      case UserNotificationType.CHARGING_STATION_STATUS_ERROR:
      case UserNotificationType.PREPARING_SESSION_NOT_STARTED:
        this.navigator.dispatch(
          StackActions.replace(
            'AppDrawerNavigator',
            {
              screen: 'ChargingStationsNavigator',
              initial: false,
              params: {
                screen: 'ChargingStationConnectorDetailsTabs',
                key: `${Utils.randomNumber()}`,
                params: {
                  params: {
                    chargingStationID: notification.data.chargeBoxID,
                    connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
                  }
                }
              }
            }
          ),
        );
        break;
      // Charger just connected
      case UserNotificationType.SESSION_NOT_STARTED_AFTER_AUTHORIZE:
      case UserNotificationType.CHARGING_STATION_REGISTERED:
        this.navigator.dispatch(
          StackActions.replace(
            'AppDrawerNavigator',
            {
              screen: 'ChargingStationsNavigator',
              initial: false,
              params: {
                screen: 'ChargingStationConnectorDetailsTabs',
                key: `${Utils.randomNumber()}`,
                params: {
                  params: {
                    chargingStationID: notification.data.chargeBoxID,
                    connectorID: 1
                  }
                }
              }
            }
          ),
        );
        break;
      // Go to Charger list
      case UserNotificationType.OFFLINE_CHARGING_STATION:
        this.navigator.dispatch(
          StackActions.replace(
            'AppDrawerNavigator',
            {
              screen: 'ChargingStationsNavigator',
              initial: false,
              key: `${Utils.randomNumber()}`,
            }
          ),
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
