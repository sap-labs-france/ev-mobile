import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import CentralServerProvider from '../provider/CentralServerProvider';
import {Notification} from '../types/UserNotifications';
import {getApplicationName, getBundleId, getVersion} from 'react-native-device-info';
import Message from '../utils/Message';
import I18n from 'i18n-js';
import SecuredStorage from '../utils/SecuredStorage';
import ProviderFactory from '../provider/ProviderFactory';
import {requestNotifications} from 'react-native-permissions';

export default class Notifications {
  private static centralServerProvider: CentralServerProvider;
  private static token: string;

  public static async initialize(): Promise<void> {
    // Setup central provider
    this.centralServerProvider = await ProviderFactory.getProvider();
    try {
      const response = await requestNotifications(['alert', 'sound']);
      if (response?.status === 'granted' ) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          this.token = fcmToken;
        }
      }
    } catch ( error ) {
      console.error(error);
    }
  }

  public static getToken(): string {
    return this.token;
  }

  public static async onTokenRefresh(newToken: string): Promise<void> {
    if (this.centralServerProvider.isUserConnected()) {
      try {
        await this.centralServerProvider.saveUserMobileData(this.centralServerProvider.getUserInfo().id, {
          mobileToken: newToken,
          mobileOS: Platform.OS,
          mobileAppName: getApplicationName(),
          mobileBundleID: getBundleId(),
          mobileVersion: getVersion()
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  public static async canHandleNotificationOpenedApp(remoteMessage: Notification): Promise<boolean> {
    const canHandleNotification = await this.canHandleNotification(remoteMessage);
    if (canHandleNotification) {
      const notificationSubdomain = remoteMessage.data.tenantSubdomain;
      if (!this.centralServerProvider.isUserConnectionValid()) {
        try {
          const userCredentials = await SecuredStorage.getUserCredentials(notificationSubdomain);
          if (userCredentials?.password && userCredentials?.email && userCredentials?.tenantSubDomain) {
            await this.centralServerProvider.login(userCredentials.email, userCredentials.password, true, userCredentials.tenantSubDomain);
          } else {
            return false;
          }
        } catch (error) {
          if (__DEV__) {
            console.log(error);
          }
          return false;
        }
      }
      const currentSubdomain = this.centralServerProvider.getUserInfo()?.tenantSubdomain;
      if (notificationSubdomain !== currentSubdomain) {
        Message.showError(I18n.t('authentication.wrongOrganization'));
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  public static async canHandleNotification(remoteMessage: Notification): Promise<boolean> {
    if (!remoteMessage?.data?.deepLink) {
      return false;
    }
    if (!remoteMessage?.notification) {
      return false;
    }
    const tenantSubdomain = remoteMessage.data.tenantSubdomain;
    if (!tenantSubdomain) {
      Message.showError(I18n.t('general.tenantMissing'));
      return false;
    }
    // Check tenant exist
    const tenant = await this.centralServerProvider.getTenant(tenantSubdomain);
    if (!tenant) {
      Message.showError(I18n.t('general.tenantUnknown', {tenantSubdomain}));
      return false;
    }
    return true;
  }
}
