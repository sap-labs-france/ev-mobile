import NotificationProvider from "./NotificationProvider";
import Constants from "../utils/Constants";
import I18n from "../I18n/I18n";
import commonColor from "../theme/variables/commonColor";
import DeviceInfo from "react-native-device-info";
import ProviderFactory from "../provider/ProviderFactory";

const _provider = ProviderFactory.getProvider();
let _notificationScheduler;

export default class NotificationScheduler {
  initialize() {
    // Create the notif provider
    this.notificationProvider = new NotificationProvider(
      this.onRegister, this.onNotify
    );
    // Start
    this.start();
  }

  static getInstance() {
    if (!_notificationScheduler) {
      // Create & Start
      _notificationScheduler = new NotificationScheduler();
    }
    return _notificationScheduler;
  }

  setNavigation(navigation) {
    this.navigation = navigation;
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
    const dateFrom = new Date(new Date().getTime() - (60 * 1000));
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
          extraData: notification
        });
      }
    }
  }

  onRegister = (token) => {
    // Do nothing
    console.log("NOTIF TOKEN");
    console.log(token);
  }

  onNotify = async (notification) => {
    console.log("NOTIF MESSAGE");
    console.log(notification);
    // User must be logged and Navigation available
    if (!(await _provider.isUserAuthenticated()) || !this.navigation) {
      return;
    }
    // Check the type of notification
    switch (notification.extraData.sourceDescr) {
      // End of Session
      case "NotifyEndOfSession":
      case "NotifyEndOfCharge":
      case "NotifyOptimalChargeReached":
      case "NotifyChargingStationStatusError":
        // Navigate
        if (notification.extraData.data && notification.extraData.data.connectorId) {
          // Navigate
          if (this.navigation) {
            this.navigation.navigate("ChargerTabNavigator", { chargerID: notification.extraData.chargeBoxID, connectorID: notification.extraData.data.connectorId })
          }
        }
        break;
      // Charger just connected
      case "NotifyChargingStationRegistered":
        // Navigate
        if (notification.extraData.data) {
          // Navigate
          if (this.navigation) {
            this.navigation.navigate("ChargerTabNavigator", { chargerID: notification.extraData.chargeBoxID, connectorID: 1 })
          }
        }
        break;
      // Unknown user
      case "NotifyUnknownUserBadged":
        break;
    }
  }
}
