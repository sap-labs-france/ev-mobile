import { NavigationContainerRef } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import CentralServerProvider from '../provider/CentralServerProvider';
import { NotificationData, UserNotificationType } from '../types/UserNotifications';
import { Dialog } from 'react-native-paper';

export default class NotificationManager {
  private static instance: NotificationManager;
  private token: string;
  private navigator: NavigationContainerRef;
  private removeNotificationDisplayedListener: () => any;
  private removeNotificationListener: () => any;
  private removeNotificationOpenedListener: () => any;
  private removeTokenRefreshListener: () => any;
  private removeForegroundNotificationListener: () => void;
  private messageListener: () => any;
  private centralServerProvider: CentralServerProvider;
 // private lastNotification: NotificationOpen;

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public setCentralServerProvider(centralServerProvider: CentralServerProvider): void {
    this.centralServerProvider = centralServerProvider;
  }

  public async initialize(navigator: NavigationContainerRef): Promise<void> {
    this.navigator = navigator;
    // Check if app has permission
    const appAuthorizationStatus = await messaging().hasPermission();
    console.log(appAuthorizationStatus);
    if (appAuthorizationStatus === messaging.AuthorizationStatus.AUTHORIZED
        || messaging.AuthorizationStatus.PROVISIONAL
        // NOT_DETERMINED is used in iOS when user permission not yet requested
        || messaging.AuthorizationStatus.NOT_DETERMINED
    ) {
      try {
        // request permission from user (mandatory in iOS, always returning AUTHORIZED on Android)
        const userAuthorizationStatus = await messaging().requestPermission();
        if (userAuthorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL) {
          try {
            // Retrieve mobile token
            const fcmToken = await messaging().getToken();
            console.log('TOOKENNNNN: ' + fcmToken);
            if ( fcmToken ) {
              this.token = fcmToken;
            }
          } catch ( error ) {
            console.error(error);
          }
        }
      } catch ( error ) {
        console.error(error);
      }
    }
  }

  public async start(): Promise<void> {
    // Check initial notification when app was closed
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      this.handleNotification(initialNotification);
    }
    // Listen for notifications when the app is in background state
    messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      this.handleNotification(remoteMessage);
    });
    // Listen for notifications when app is in foreground state
    this.removeForegroundNotificationListener = messaging().onMessage((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });
  }

    private handleNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    // Check remote message is of notification type
    if (remoteMessage?.notification) {
      const notificationData = remoteMessage.data as unknown as NotificationData;
      if (notificationData) {
        const notificationType = notificationData?.notificationType;
        switch ( notificationType ) {
          case UserNotificationType.END_USER_ERROR:
            const errorMessage = remoteMessage.notification.body;
            const errorTitle = remoteMessage.notification.title;
            Alert.alert(errorTitle, errorMessage);
        }
      }
    }



    /*this.removeNotificationListener = firebase.notifications().onNotification(async (notification: Notification) => {
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
    });*/
  }

  public stop() {
    this.removeForegroundNotificationListener?.();
    // this.removeNotificationDisplayedListener();
    // this.removeNotificationListener();
    // this.removeNotificationOpenedListener();
    // this.removeTokenRefreshListener();
    // this.messageListener();
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

  // eslint-disable-next-line complexity
/*  private async processOpenedNotification(notificationOpen: NotificationOpen): Promise<boolean> {
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
          await this.centralServerProvider.login(userCredentials.email, userCredentials.password, true, userCredentials.tenantSubDomain);
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
        this.navigator.navigate('TransactionHistoryNavigator', {screen: "TransactionDetailsTabs", key: `${Utils.randomNumber()}`,
          params: {
              params: {
                transactionID: Utils.convertToInt(notification.data.transactionId)
              }
            }});
        break;
      // Session In Progress
      case UserNotificationType.SESSION_STARTED:
      case UserNotificationType.END_OF_CHARGE:
      case UserNotificationType.OPTIMAL_CHARGE_REACHED:
        this.navigator.navigate('TransactionInProgressNavigator', {screen: "ChargingStationConnectorDetailsTabs", key: `${Utils.randomNumber()}`,
          params: {
            params: {
              chargingStationID: notification.data.chargeBoxID,
              connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
            }
        }
        });
        break;
      case UserNotificationType.CHARGING_STATION_STATUS_ERROR:
      case UserNotificationType.PREPARING_SESSION_NOT_STARTED:
        this.navigator.navigate('ChargingStationsNavigator', {screen: "ChargingStationConnectorDetailsTabs", key: `${Utils.randomNumber()}`,
          params: {
            params: {
              chargingStationID: notification.data.chargeBoxID,
              connectorID: Utils.getConnectorIDFromConnectorLetter(notification.data.connectorId)
            }
          }
        });
        break;
      // Charger just connected
      case UserNotificationType.SESSION_NOT_STARTED_AFTER_AUTHORIZE:
      case UserNotificationType.CHARGING_STATION_REGISTERED:
         this.navigator.navigate('ChargingStationsNavigator', {screen: "ChargingStationConnectorDetailsTabs", key: `${Utils.randomNumber()}`,
          params: {
            params: {
              chargingStationID: notification.data.chargeBoxID,
              connectorID: 1
            }
          }
        });
        break;
      // Go to Charger list
      case UserNotificationType.OFFLINE_CHARGING_STATION:
         this.navigator.navigate('ChargingStationsNavigator', {key: `${Utils.randomNumber()}`,
        });
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
  }*/
}
