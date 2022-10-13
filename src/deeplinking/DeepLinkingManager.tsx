import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';

import CentralServerProvider from '../provider/CentralServerProvider';
import { HTTPError } from '../types/HTTPError';
import Constants from '../utils/Constants';
import Message from '../utils/Message';
import Utils from '../utils/Utils';

export default class DeepLinkingManager {
  private static instance: DeepLinkingManager;
  private navigator: NavigationContainerRef<ReactNavigation.RootParamList>;
  private centralServerProvider: CentralServerProvider;
  private url: string;
  private readonly scheme: string = 'https://';

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static getInstance(): DeepLinkingManager {
    if (!DeepLinkingManager.instance) {
      DeepLinkingManager.instance = new DeepLinkingManager();
    }
    return DeepLinkingManager.instance;
  }

  public async initialize(navigator: NavigationContainerRef<ReactNavigation.RootParamList>, centralServerProvider: CentralServerProvider) {
    // Keep
    this.navigator = navigator;
    this.centralServerProvider = centralServerProvider;
    // Activate Deep Linking
    DeepLinking.addScheme(this.scheme);
    // Workaround to allow opening the app when link has been opened by the dashboard
    DeepLinking.addScheme('eMobility://');
    // Init Routes
    this.addResetPasswordRoute();
    this.addVerifyAccountRoute();
    // Init URL
    try {
      const initialURL = await Linking.getInitialURL();
      if ( initialURL ) {
        await this.handleUrl({ url: initialURL });
      }
    } catch ( err ) {
      console.error('An error occurred', err);
    }
  }

  public startListening() {
    const linkingSubscription = Linking.addEventListener('url', this.handleUrl.bind(this));
    return () => {
      linkingSubscription?.remove();
    };
  }

  public async handleUrl({ url }: { url: string }): Promise<void> {
    this.url = url;
    DeepLinking.evaluateUrl(url);
  }

  private getTenantSubdomainFromURL(): string {
    const regex = new RegExp('\\/\\/(.*?)\\.');
    const res =  this.url?.match(regex);
    return res?.[1];
  }

  private addResetPasswordRoute(): void {
    // Handle reset password request
    const definePasswordCallback = async (subdomain: string, params: Record<string, string>) => {
      if (!subdomain) {
        Message.showError(I18n.t('authentication.invalidLinkNoSubdomain'));
        return;
      }
      const tenant = await this.centralServerProvider.getTenant(subdomain);
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant', {tenantSubdomain: subdomain}));
        return;
      }
      const hash = params?.hash;
      if (!hash) {
        Message.showError(I18n.t('authentication.invalidLinkNoHash'));
        return;
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      // Navigate
      this.navigator.navigate('ResetPassword', {
        key: `${Utils.randomNumber()}`,
        tenantSubDomain: subdomain,
        hash,
        load: true
      });
    };
    // Add route to handle links from the dashboard
    DeepLinking.addRoute('/resetPassword/:tenant/:hash', ({tenant, ...params}: {tenant: string; hash: string}) => {
      void definePasswordCallback(tenant, params as Record<any, any>);
    });
    // Add route to handle links directly from the mails
    DeepLinking.addRoute('/define-password:hash', () => {
      const subdomain = this.getTenantSubdomainFromURL();
      const params = Utils.getURLParameters(this.url) as {hash: string};
      void definePasswordCallback(subdomain, params);
    });
  }

  private addVerifyAccountRoute(): void {
    // Handle verify account request
    const verifyAccountCallback = async (subdomain: string, params: Record<string, string>) => {
      const tenant = await this.centralServerProvider.getTenant(subdomain);
      const email = params?.Email;
      const verificationToken = params?.VerificationToken;
      const resetToken = params?.ResetToken;
      // Check params
      if (!email) {
        Message.showError(I18n.t('authentication.invalidLinkNoEmail'));
        return;
      }
      if (!subdomain) {
        Message.showError(I18n.t('authentication.invalidLinkNoSubdomain'));
        return;
      }
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant', {tenantSubdomain: subdomain}));
        return;
      }
      if (!verificationToken) {
        Message.showError(I18n.t('authentication.invalidLinkNoToken'));
        return;
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      await this.centralServerProvider.logoff();
      // Navigate to login page
      this.navigator.navigate('Login', {
        key: `${Utils.randomNumber()}`,
        tenantSubDomain: subdomain,
        email
      });
      // Call the backend
      try {
        // Validate Account
        const result = await this.centralServerProvider.verifyEmail(subdomain, email, verificationToken);
        if (result.status === Constants.REST_RESPONSE_SUCCESS) {
          Message.showSuccess(I18n.t('authentication.accountVerifiedSuccess'));
          // Check if user has to change his password
          if (resetToken && resetToken !== 'null') {
            // Change password
            this.navigator.dispatch(
              CommonActions.navigate({
                name: 'ResetPassword',
                key: `${Utils.randomNumber()}`,
                params: { tenantSubDomain: subdomain, hash: resetToken, email }
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
              Message.showError(I18n.t('authentication.verifyAccountTokenNotValid'));
              break;
              // Email does not exist
            case StatusCodes.NOT_FOUND:
              Message.showError(I18n.t('authentication.activationEmailNotValid', {tenantName: tenant?.name}));
              break;
              // Other common Error
            default:
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.activationUnexpectedError');
          }
        } else {
          Message.showError(I18n.t('authentication.activationUnexpectedError'));
        }
      }
    };
    // Add route to handle links from the dashboard
    DeepLinking.addRoute(
      '/verifyAccount/:tenant/:email/:token/:resetToken',
      ({ tenant, ...params}: {tenant: string; email: string; token: string; resetToken: string}) => {
        void verifyAccountCallback(tenant, params as Record<any, any>);
      });
    // Add route to handle links directly from the mails
    DeepLinking.addRoute('/verify-email:params', () => {
      const params = Utils.getURLParameters(this.url) as {Email: string; VerificationToken: string; ResetToken: string};
      const subdomain = this.getTenantSubdomainFromURL();
      void verifyAccountCallback(subdomain, params);
    }
    );
  }
}
