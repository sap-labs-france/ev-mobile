import NotificationProvider from "./NotificationProvider";
import ProviderFactory from "../provider/ProviderFactory";
import Constants from "../utils/Constants";
import I18n from "../I18n/I18n";

const _provider = ProviderFactory.getProvider();

export default class NotificationScheduler {
  constructor() {
    // Create the notif provider
    this.notificationProvider = new NotificationProvider(
      this.onRegister, this.onNotify
    );
  }

  start() {
    // Refresh
    this.checkAndTriggerNotifications();
    // Check every minutes
    this.notificationCheck = setInterval(() => {
      // Refresh
      this.checkAndTriggerNotifications();
    }, Constants.AUTO_REFRESH_PUSH_NOTIF_PERIOD_MILLIS);
  }

  async checkAndTriggerNotifications() {
    const user = await _provider.getUserInfo();
    // Read the last notification
    let notifications = null;
    if ((await _provider.getSecurityProvider()).isAdmin()) {
      notifications = await _provider.getNotifications({}, {limit: 5, skip: 0});
    } else {
      notifications = await _provider.getNotifications({UserID: user.id}, {limit: 5, skip: 0});
    }
    // Check
    for (const notification of notifications.result) {
      // Only emails
      if (notification.channel !== "email") {
        continue;
      }
      // Notify only admin on usual operations
      if (notification.userID && notification.userID !== user.id) {
        continue;
      }
      // Check if it occurred in the last two minutes
      const elapsedTimeMillis = (new Date().getTime() - new Date(notification.timestamp).getTime());
      // Only last minute notifications
      if (elapsedTimeMillis < Constants.AUTO_REFRESH_PUSH_NOTIF_PERIOD_MILLIS) {
        let message = null, subMessage = null, longMessage = null;
        // Check the type of notification
        switch (notification.sourceDescr) {
          // End of Session
          case "NotifyEndOfSession":
            message = I18n.t("notifications.notifyEndOfSession.message", {chargeBoxID: notification.chargeBoxID});
            subMessage = I18n.t("notifications.notifyEndOfSession.subMessage");
            longMessage = I18n.t("notifications.notifyEndOfSession.longMessage", {chargeBoxID: notification.chargeBoxID});
            break;
          // End of Charge
          case "NotifyEndOfCharge":
            message = I18n.t("notifications.notifyEndOfCharge.message", {chargeBoxID: notification.chargeBoxID});
            subMessage = I18n.t("notifications.notifyEndOfCharge.subMessage");
            longMessage = I18n.t("notifications.notifyEndOfCharge.longMessage", {chargeBoxID: notification.chargeBoxID});
            break;
          // Optimal Charge
          case "NotifyOptimalChargeReached":
            message = I18n.t("notifications.notifyOptimalChargeReached.message", {chargeBoxID: notification.chargeBoxID});
            subMessage = I18n.t("notifications.notifyOptimalChargeReached.subMessage");
            longMessage = I18n.t("notifications.notifyOptimalChargeReached.longMessage", {chargeBoxID: notification.chargeBoxID});
            break;
          // Charger in Error
          case "NotifyChargingStationStatusError":
            message = I18n.t("notifications.notifyChargingStationStatusError.message", {
              chargeBoxID: notification.chargeBoxID,
              connectorId: (notification.data ? notification.data.connectorId : "Unknown"),
              error: (notification.data ? notification.data.error : "Unknown")
            });
            subMessage = I18n.t("notifications.notifyChargingStationStatusError.subMessage");
            longMessage = I18n.t("notifications.notifyChargingStationStatusError.longMessage", {
              chargeBoxID: notification.chargeBoxID,
              connectorId: (notification.data ? notification.data.connectorId : "Unknown"),
              error: (notification.data ? notification.data.error : "Unknown")
            });
            break;
          // Charger just connected
          case "NotifyChargingStationRegistered":
            message = I18n.t("notifications.notifyChargingStationRegistered.message", {chargeBoxID: notification.chargeBoxID});
            subMessage = I18n.t("notifications.notifyChargingStationRegistered.subMessage");
            longMessage = I18n.t("notifications.notifyChargingStationRegistered.longMessage", {chargeBoxID: notification.chargeBoxID});
            break;
          // Unknown user
          case "NotifyUnknownUserBadged":
            message = I18n.t("notifications.notifyUnknownUserBadged.message", {chargeBoxID: notification.chargeBoxID});
            subMessage = I18n.t("notifications.notifyUnknownUserBadged.subMessage");
            longMessage = I18n.t("notifications.notifyUnknownUserBadged.longMessage", {chargeBoxID: notification.chargeBoxID});
            break;
        }
        // Send the notification
        if (message) {
          // Send
          await this.notificationProvider.sendNotification({
            title: "eMobility",
            message: message,
            subText: subMessage,
            bigText: longMessage,
            color: "blue",
            vibrate: true,
            vibrationMillis: 300,
            playSound: true
          });
        }
      }
    }
  }

  onRegister(token) {
    console.log("onRegister");
    console.log(token);
  }

  onNotify(notif) {
    console.log("onNotify");
    console.log(notif);
  }
}