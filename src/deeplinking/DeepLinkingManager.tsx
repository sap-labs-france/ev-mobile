import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { EmitterSubscription, Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';

import CentralServerProvider from '../provider/CentralServerProvider';
import { HTTPError } from '../types/HTTPError';
import Constants from '../utils/Constants';
import Message from '../utils/Message';
import Utils from '../utils/Utils';

export default class DeepLinkingManager {
  public static readonly PATH_CHARGING_STATIONS = 'charging-stations';
  public static readonly PATH_TRANSACTIONS = 'transactions';
  public static readonly PATH_LOGIN = 'login';
  public static readonly PATH_INVOICES = 'invoices';
  public static readonly PATH_RESERVATIONS = 'reservations';
  public static readonly FRAGMENT_IN_ERROR = 'inerror';
  public static readonly FRAGMENT_ALL = 'all';
  public static readonly FRAGMENT_IN_PROGRESS = 'inprogress';
  public static readonly FRAGMENT_HISTORY = 'history';
  private static instance: DeepLinkingManager;
  private navigator: NavigationContainerRef<ReactNavigation.RootParamList>;
  private centralServerProvider: CentralServerProvider;
  private linkingSubscription: EmitterSubscription;

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static getAuthorizedURLs(): string[] {
    return [
      ...((__DEV__ && ['http://*.localhost:45000']) || []),
      'https://*.e-mobility-group.org',
      'https://*.e-mobility-group.com',
      'https://*.e-mobility-group.eu',
      'https://*.e-mobility-labs.com',
      'https://*.e-mobility-labs.org',
      'https://*.qa-e-mobility-group.com',
    ];
  }

  public static getInstance(): DeepLinkingManager {
    if (!DeepLinkingManager.instance) {
      DeepLinkingManager.instance = new DeepLinkingManager();
    }
    return DeepLinkingManager.instance;
  }

  public initialize(navigator: NavigationContainerRef<ReactNavigation.RootParamList>, centralServerProvider: CentralServerProvider) {
    // Keep
    this.navigator = navigator;
    this.centralServerProvider = centralServerProvider;
    // Activate Deep Linking
    DeepLinking.addScheme('eMobility://');
    DeepLinking.addScheme('emobility://');
    // Init Routes
    this.addResetPasswordRoute();
    this.addVerifyAccountRoute();
    // Init URL
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          Linking.openURL(url);
        }
      })
      .catch((err) => {
        console.error('An error occurred', err);
      });
  }

  public startListening() {
    this.linkingSubscription = Linking.addEventListener('url', this.handleUrl);
  }

  public stopListening() {
    this.linkingSubscription?.remove();
  }

  public handleUrl = ({ url }: { url: string }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };

  private addResetPasswordRoute = () => {
    // Add Route
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    DeepLinking.addRoute('/resetPassword/:tenant/:hash', async (response: { tenant: string; hash: string }) => {
      // Check params
      if (!response.tenant) {
        Message.showError(I18n.t('authentication.mandatoryTenant'));
      }
      // Get the Tenant
      const tenant = await this.centralServerProvider.getTenant(response.tenant);
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant'));
      }
      if (!response.hash) {
        Message.showError(I18n.t('authentication.resetPasswordHashNotValid'));
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      // Navigate
      this.navigator.navigate('ResetPassword', {
        key: `${Utils.randomNumber()}`,
        params: { tenantSubDomain: response.tenant, hash: response.hash }
      }
      );
    });
  };

  private addVerifyAccountRoute = () => {
    // Add Route
    DeepLinking.addRoute(
      '/verifyAccount/:tenant/:email/:token/:resetToken',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (response: { tenant: string; email: string; token: string; resetToken: string }) => {
        // Check params
        if (!response.tenant) {
          Message.showError(I18n.t('authentication.mandatoryTenant'));
        }
        if (!response.email) {
          Message.showError(I18n.t('authentication.mandatoryEmail'));
        }
        // Get the Tenant
        const tenant = await this.centralServerProvider.getTenant(response.tenant);
        if (!tenant) {
          Message.showError(I18n.t('authentication.unknownTenant'));
        }
        if (!response.token) {
          Message.showError(I18n.t('authentication.verifyAccountTokenNotValid'));
        }
        // Disable
        this.centralServerProvider.setAutoLoginDisabled(true);
        await this.centralServerProvider.logoff();
        // Navigate to login page
        this.navigator.dispatch(
          CommonActions.navigate({
            name: 'Login',
            key: `${Utils.randomNumber()}`,
            params: { tenantSubDomain: response.tenant, email: response.email }
          })
        );
        // Call the backend
        try {
          // Validate Account
          const result = await this.centralServerProvider.verifyEmail(response.tenant, response.email, response.token);
          if (result.status === Constants.REST_RESPONSE_SUCCESS) {
            Message.showSuccess(I18n.t('authentication.accountVerifiedSuccess'));
            // Check if user has to change his password
            if (response.resetToken && response.resetToken !== 'null') {
              // Change password
              this.navigator.dispatch(
                CommonActions.navigate({
                  name: 'ResetPassword',
                  key: `${Utils.randomNumber()}`,
                  params: { tenantSubDomain: response.tenant, hash: response.resetToken }
                })
              );
            }
          }
        } catch (error) {
          // Check request?
          if (error.request) {
            // Show error
            switch (error.request.status) {
              // Account already active
              case HTTPError.USER_ACCOUNT_ALREADY_ACTIVE_ERROR:
                Message.showError(I18n.t('authentication.accountAlreadyActive'));
                break;
              // VerificationToken no longer valid
              case HTTPError.INVALID_TOKEN_ERROR:
                Message.showError(I18n.t('authentication.activationTokenNotValid'));
                break;
              // Email does not exist
              case StatusCodes.NOT_FOUND:
                Message.showError(I18n.t('authentication.activationEmailNotValid'));
                break;
              // Other common Error
              default:
                await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.activationUnexpectedError');
            }
          } else {
            Message.showError(I18n.t('authentication.activationUnexpectedError'));
          }
        }
      }
    );
  };
}
