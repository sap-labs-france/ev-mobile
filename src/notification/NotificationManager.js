import NotificationProvider from "./NotificationProvider";
import Constants from "../utils/Constants";
import I18n from "../I18n/I18n";
import commonColor from "../theme/variables/commonColor";
import DeviceInfo from "react-native-device-info";
import ProviderFactory from "../provider/ProviderFactory";
import Message from "../utils/Message";


const _provider = ProviderFactory.getProvider();
const _notifications = [];
let _notificationManager;
let _token;

export default class NotificationManager {
  initialize() {
    // Create the notif provider
    this.notificationProvider = new NotificationProvider(
      this.onRegister, this.onNotify
    );
    // Set inactive
    this._active = false;
    // No timer
    this.notificationCheck = null;
  }

  static getInstance() {
    if (!_notificationManager) {
      // Create
      _notificationManager = new NotificationManager();
    }
    return _notificationManager;
  }

  setActive(active) {
    console.log("setActive = " + active);
    this._active = active;
  }

  isActive() {
    return this._active;
  }

  setNavigation(navigation) {
    console.log("setNavigation = " + navigation);
    this.navigation = navigation;
  }

  start() {
    console.log("start");
    // Check
    if (!this.notificationCheck) {
      // Refresh
      this.processNotification();
      // Check every minutes
      this.notificationCheck = setInterval(() => {
        // Refresh
        this.processNotification();
      }, Constants.AUTO_REFRESH_VERY_SHORT_PERIOD_MILLIS);
    }
  }

  stop() {
    console.log("stop");
    // Check
    if (this.notificationCheck) {
      clearInterval(this.notificationCheck);
      this.notificationCheck = null;
    }
  }

  async sendLocalNotification(notification) {
    console.log("sendLocalNotification");
    console.log(notification);
    // Text?
    if (typeof notification.extraData === "string") {
      // Convert ot JSon
      notification.extraData = JSON.parse(notification.extraData);
    }
    // Yes: meaning user clicked on the notification, then it should navigate
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
      console.log(message);
      // Send
      await this.notificationProvider.sendLocalNotification({
        title: DeviceInfo.getApplicationName(),
        message: message,
        subText: subMessage,
        bigText: longMessage,
        color: color,
        extraData: notification
      });
    }
  }

  async processNotification() {
    let notification;
    console.log("processNotification");
    // Check if active
    if (this.isActive()) {
      console.log("processNotification - active");
      // Process the notifications
      while ((notification = _notifications.splice(0,1)[0]) !== undefined) {
        console.log("processNotification - notification");
        console.log(notification);
        // Check if the app was opened
        if (notification.foreground) {
          console.log("Send Local Notif");
          // Yes: meaning user didn't get the notif, then show a local one
          this.sendLocalNotification(notification);
        } else {
          console.log("Remote Notif: Navigate");
          // No: meaning the user got the notif and clicked on it, then navigate to the right screen
          // User must be logged
          if (!(await _provider.isUserAuthenticated())) {
            // Show
            console.log("Remote Notif: User must login");
            Message.showError(I18n.t("notification.mustLogin"));
            return;
          }
          // Must have Navigation 
          if (!this.navigation) {
            // Show
            console.log("Remote Notif: No navigation");
            Message.showError(I18n.t("notification.cannotNavigate"));
            return;
          }
          // Extra Data must be available
          if (!notification.extraData) {
            // Show
            console.log("Remote Notif: No extra data");
            Message.showError(I18n.t("notification.extraDataMissing"));
            return;
          }
          // Text?
          if (typeof notification.extraData === "string") {
            // Convert ot JSon
            notification.extraData = JSON.parse(notification.extraData);
          }
          // Same Tenant
          if ((await _provider.getTenant()) === notification.extraData.tenant) {
            // Show
            console.log("Remote Notif: Incorrect tenant");
            Message.showError(I18n.t("notification.incorrectTenant"));
            return;
          }
          // Check the type of notification
          if (notification.extraData) {
            // Check
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
      }
    }
  }

  getToken() {
    return _token;
  }

  onRegister = (token) => {
    // Keep the token
    _token = token;
    // Do nothing
    console.log("NOTIF TOKEN");
    console.log(token);
  }

  onNotify = async (notification) => {
    console.log("NOTIF MESSAGE");
    console.log(notification);
    // Add Notification
    _notifications.push(notification);
  }
}
