import NotificationProvider from "./NotificationProvider";
import ProviderFactory from "../provider/ProviderFactory";
import Constants from "../utils/Constants";

const _provider = ProviderFactory.getProvider();

export default class NotificationScheduler {
  constructor() {
    // Create the notif provider
    this.notificationProvider = new NotificationProvider(
      this.onRegister, this.onNotify
    );
  }

  start() {
    // Check every minutes
    this.notificationCheck = setInterval(() => {
      // Refresh
      this.checkAndTriggerNotifications();
    }, Constants.AUTO_REFRESH_PUSH_NOTIF_PERIOD_MILLIS);
  }

  checkAndTriggerNotifications() {
    // Read the notification
    this.notificationProvider.sendNotification({});
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