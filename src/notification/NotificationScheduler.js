import NotificationProvider from "./NotificationProvider";
import Constants from "../utils/Constants";
import I18n from "../I18n/I18n";
import commonColor from "../theme/variables/commonColor";
import DeviceInfo from "react-native-device-info";

import ProviderFactory from "../provider/ProviderFactory";
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

  stop() {
    // Check
    if (this.notificationCheck) {
      clearInterval(this.notificationCheck);
      this.notificationCheck = null;
    }
  }

  async checkAndTriggerNotifications() {
    // User must be logged
    if (!(await _provider.isUserAuthenticated())) {
      return;
    }
    // Get the logged user
    const user = await _provider.getUserInfo();
    // Get the last minute notifications
    // const dateFrom = new Date(new Date().getTime() - (60 * 1000));
    const dateFrom = new Date("2019-01-15T19:21:00");
    // Read the last notification
    const notifications = await _provider.getNotifications({
        UserID: user.id, Channel: "email", DateFrom: dateFrom.toISOString()
      },
      { limit: 5, skip: 0 }
    );
    // Check
    for (const notification of notifications.result) {
      let message = null, subMessage = null, longMessage = null, color = commonColor.brandInfo;
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
          color = commonColor.brandDanger;
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
          color = commonColor.brandDanger;
          message = I18n.t("notifications.notifyChargingStationRegistered.message", {chargeBoxID: notification.chargeBoxID});
          subMessage = I18n.t("notifications.notifyChargingStationRegistered.subMessage");
          longMessage = I18n.t("notifications.notifyChargingStationRegistered.longMessage", {chargeBoxID: notification.chargeBoxID});
          break;
        // Unknown user
        case "NotifyUnknownUserBadged":
          color = commonColor.brandDanger;
          message = I18n.t("notifications.notifyUnknownUserBadged.message", {chargeBoxID: notification.chargeBoxID});
          subMessage = I18n.t("notifications.notifyUnknownUserBadged.subMessage");
          longMessage = I18n.t("notifications.notifyUnknownUserBadged.longMessage", {chargeBoxID: notification.chargeBoxID});
          break;
      }
      // Send the notification
      if (message) {
        // Send
        await this.notificationProvider.sendNotification({
          title: DeviceInfo.getApplicationName(),
          message: message,
          subText: subMessage,
          bigText: longMessage,
          color: color,
          extraData: JSON.stringify(notification)
        });
      }
    }
  }

  onRegister(token) {
    // Do nothing
  }

  async onNotify(notification) {
    console.log("onNotify");
    console.log(notification);
    // User must be logged
    if (!(await _provider.isUserAuthenticated())) {
      return;
    }
    // Get back the original notification
    const notificationBackend = JSON.parse(notification.userInfo);
    console.log(notificationBackend);
    
    // Check the type of notification
    switch (notificationBackend.sourceDescr) {
      // End of Session
      case "NotifyEndOfSession":
        break;
      // End of Charge
      case "NotifyEndOfCharge":
        break;
      // Optimal Charge
      case "NotifyOptimalChargeReached":
        break;
      // Charger in Error
      case "NotifyChargingStationStatusError":
        break;
      // Charger just connected
      case "NotifyChargingStationRegistered":
        break;
      // Unknown user
      case "NotifyUnknownUserBadged":
        break;
    }
  }
}