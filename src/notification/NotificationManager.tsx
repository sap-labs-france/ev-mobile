import { PushNotification } from "react-native-push-notification";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
// import Message from "../utils/Message";

export default class NotificationManager {
  private static notificationManager: NotificationManager;
  private token: string;
  private notifications: PushNotification[] = [];
  private active: boolean;

  public static getInstance(): NotificationManager {
    if (!this.notificationManager) {
      // Create
      this.notificationManager = new NotificationManager();
    }
    return this.notificationManager;
  }

  public async initialize() {
    // // Create the notif provider
    // this.notificationProvider = new NotificationProvider(this.onRegister, this.onNotify);
    // // Set inactive
    // this._active = false;
    // // No timer
    // this.notificationCheck = null;
  }

  public setActive(active: boolean) {
    // console.log("setActive = " + active);
    // this._active = active;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setNavigation(navigation: NavigationScreenProp<NavigationState, NavigationParams>) {
    // console.log("setNavigation = " + navigation);
    // this.navigation = navigation;
  }

  public start() {
    // console.log("start");
    // // Check
    // if (!this.notificationCheck) {
    //   // Refresh
    //   this.processNotification();
    //   // Check every minutes
    //   this.notificationCheck = setInterval(() => {
    //     // Refresh
    //     this.processNotification();
    //   }, Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS);
    // }
  }

  public stop() {
    // console.log("stop");
    // // Check
    // if (this.notificationCheck) {
    //   clearInterval(this.notificationCheck);
    //   this.notificationCheck = null;
    // }
  }

  public async sendLocalNotification(notification: PushNotification) {
    // console.log("triggerLocalNotification");
    // // Text?
    // if (typeof notification.extraData === "string") {
    //   // Convert ot JSon
    //   notification.extraData = JSON.parse(notification.extraData);
    // }
    // // Yes: meaning user clicked on the notification, then it should navigate
    // let message = null,
    //   subMessage = null,
    //   longMessage = null,
    //   color = commonColor.brandInfo;
    // // Check the type of notification
    // switch (notification.sourceDescr) {
    //   // End of Transaction
    //   case "NotifyEndOfTransaction":
    //     message = I18n.t("notifications.notifyEndOfTransaction.message", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     subMessage = I18n.t("notifications.notifyEndOfTransaction.subMessage");
    //     longMessage = I18n.t("notifications.notifyEndOfTransaction.longMessage", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     break;
    //   // End of Charge
    //   case "NotifyEndOfCharge":
    //     message = I18n.t("notifications.notifyEndOfCharge.message", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     subMessage = I18n.t("notifications.notifyEndOfCharge.subMessage");
    //     longMessage = I18n.t("notifications.notifyEndOfCharge.longMessage", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     break;
    //   // Optimal Charge
    //   case "NotifyOptimalChargeReached":
    //     message = I18n.t("notifications.notifyOptimalChargeReached.message", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     subMessage = I18n.t("notifications.notifyOptimalChargeReached.subMessage");
    //     longMessage = I18n.t("notifications.notifyOptimalChargeReached.longMessage", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     break;
    //   // Charger in Error
    //   case "NotifyChargingStationStatusError":
    //     color = commonColor.brandDanger;
    //     message = I18n.t("notifications.notifyChargingStationStatusError.message", {
    //       chargeBoxID: notification.chargeBoxID,
    //       connectorId: notification.data ? notification.data.connectorId : "Unknown",
    //       error: notification.data ? notification.data.error : "Unknown"
    //     });
    //     subMessage = I18n.t("notifications.notifyChargingStationStatusError.subMessage");
    //     longMessage = I18n.t("notifications.notifyChargingStationStatusError.longMessage", {
    //       chargeBoxID: notification.chargeBoxID,
    //       connectorId: notification.data ? notification.data.connectorId : "Unknown",
    //       error: notification.data ? notification.data.error : "Unknown"
    //     });
    //     break;
    //   // Charger just connected
    //   case "NotifyChargingStationRegistered":
    //     color = commonColor.brandDanger;
    //     message = I18n.t("notifications.notifyChargingStationRegistered.message", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     subMessage = I18n.t("notifications.notifyChargingStationRegistered.subMessage");
    //     longMessage = I18n.t("notifications.notifyChargingStationRegistered.longMessage", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     break;
    //   // Unknown user
    //   case "NotifyUnknownUserBadged":
    //     color = commonColor.brandDanger;
    //     message = I18n.t("notifications.notifyUnknownUserBadged.message", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     subMessage = I18n.t("notifications.notifyUnknownUserBadged.subMessage");
    //     longMessage = I18n.t("notifications.notifyUnknownUserBadged.longMessage", {
    //       chargeBoxID: notification.chargeBoxID
    //     });
    //     break;
    // }
    // // Send the notification
    // if (message) {
    //   // Send
    //   await this.notificationProvider.sendLocalNotification({
    //     title: DeviceInfo.getApplicationName(),
    //     message,
    //     subText: subMessage,
    //     bigText: longMessage,
    //     color,
    //     extraData: notification
    //   });
    // }
  }

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

  public getToken(): string {
    return this.token;
  }

  public onRegister = (token: string) => {
    // Keep the token
    token = token;
    // console.log("NOTIF TOKEN");
    // console.log(token);
  };

  public onNotify = async (notification: PushNotification) => {
    // console.log("NOTIF MESSAGE");
    // console.log(notification);
    // Add Notification
    this.notifications.push(notification);
  };
}
