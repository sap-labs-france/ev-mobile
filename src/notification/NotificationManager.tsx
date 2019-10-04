import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { PushNotification as PushNotificationMessage } from 'react-native-push-notification';
import { NavigationContainerComponent } from 'react-navigation';

export default class NotificationManager {
  private static notificationManager: NotificationManager;
  private token: string;
  private os: string;
  private navigation: NavigationContainerComponent;

  public static getInstance(): NotificationManager {
    if (!this.notificationManager) {
      this.notificationManager = new NotificationManager();
    }
    return this.notificationManager;
  }

  public async initialize(navigation: NavigationContainerComponent) {
    // Keep    console.log("NOTIF TOKEN");
    console.log('INIT NOTIFICATION');
    this.navigation = navigation;
    // PushNotificationIOS.addEventListener('register', (token) => {
    //   console.log("NOTIF TOKEN IOS");
    //   console.log(token);
    //   this.token = token;
    // });
    // Init
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: this.onRegister,
      // (required) Called when a remote or local notification is opened or received
      onNotification: this.onNotification,
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: '49073993741',
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      // Should the initial notification be popped automatically
      popInitialNotification: true,
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  }

  public getToken(): string {
    return this.token;
  }

  public getOS(): string {
    return this.os;
  }

  public onRegister = (token: { os: string; token: string }) => {
    console.log('NOTIF TOKEN');
    console.log(token);
    // Keep the token
    this.token = token.token;
    this.os = token.os;
  };

  public onNotification = async (notification: PushNotificationMessage) => {
    console.log('NOTIF MESSAGE');
    console.log(notification);
    if (notification.userInteraction) {

    }
    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  public async processNotification() {
    // let notification;
    // console.log("processNotification");
    // // Check if active
    // if (this.isActive()) {
    //   console.log("processNotification - active");
    //   // Process the notifications
    //   while ((notification = notifications.splice(0, 1)[0]) !== undefined) {
    //     console.log("processNotification - notification");
    //     console.log(notification);
    //     // Check if the app was opened
    //     if (notification.foreground) {
    //       console.log("Send Local Notif");
    //       // Yes: meaning user didn't get the notif, then show a local one
    //       this.sendLocalNotification(notification);
    //     } else {
    //       console.log("Remote Notif: Navigate");
    //       // No: meaning the user got the notif and clicked on it, then navigate to the right screen
    //       // User must be logged and Navigation available
    //       if (!(await _provider.isUserConnectionValid()) || !this.navigation) {
    //         return;
    //       }
    //       // Text?
    //       if (typeof notification.extraData === "string") {
    //         // Convert ot JSon
    //         notification.extraData = JSON.parse(notification.extraData);
    //       }
    //       // Check the type of notification
    //       if (notification.extraData) {
    //         // Check
    //         switch (notification.extraData.sourceDescr) {
    //           // End of Transaction
    //           case "NotifyEndOfTransaction":
    //           case "NotifyEndOfCharge":
    //           case "NotifyOptimalChargeReached":
    //           case "NotifyChargingStationStatusError":
    //             // Navigate
    //             if (notification.extraData.data && notification.extraData.data.connectorId) {
    //               // Navigate
    //               if (this.navigation) {
    //                 this.navigation.navigate("ChargerDetailsTabs", {
    //                   chargerID: notification.extraData.chargeBoxID,
    //                   connectorID: notification.extraData.data.connectorId
    //                 });
    //               }
    //             }
    //             break;
    //           // Charger just connected
    //           case "NotifyChargingStationRegistered":
    //             // Navigate
    //             if (notification.extraData.data) {
    //               // Navigate
    //               if (this.navigation) {
    //                 this.navigation.navigate("ChargerDetailsTabs", {
    //                   chargerID: notification.extraData.chargeBoxID,
    //                   connectorID: 1
    //                 });
    //               }
    //             }
    //             break;
    //           // Unknown user
    //           case "NotifyUnknownUserBadged":
    //             break;
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
