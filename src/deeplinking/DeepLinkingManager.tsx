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
    // Init Routes
    this.addResetPasswordRoute();
    this.addVerifyAccountRoute();
    // Init URL
    try {
      const initialURL = await Linking.getInitialURL();
      if ( initialURL ) {
        this.handleUrl({ url: initialURL });
      }
    } catch ( err ) {
      console.error('An error occurred', err);
    }
  }

  public startListening() {
    const linkingSubscription = Linking.addEventListener('url', this.handleUrl.bind(this));
    return () => {
      linkingSubscription?.remove();
    }
  }

  public async handleUrl({ url }: { url: string }): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      this.url = url;
      DeepLinking.evaluateUrl(url);

    }
  }

  private addResetPasswordRoute(): void {
    // Add Route
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    DeepLinking.addRoute('/define-password:hash', async (response) => {
      const subdomain = this.getTenant();
      const tenant = await this.centralServerProvider.getTenant(subdomain);
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant'));
        return;
      }
      const hash = response.hash.split('=')?.[1];
      if (!hash) {
        Message.showError(I18n.t('authentication.resetPasswordHashNotValid'));
        return;
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      // Navigate
      this.navigator.navigate('ResetPassword', {
        key: `${Utils.randomNumber()}`,
        tenantSubDomain: subdomain,
        hash
      })
    });
  }

  private getTenant(): string {
    const regex = new RegExp('\\/\\/(.*?)\\.');
    const res =  this.url?.match(regex);
    return res?.[1];
  }

  private addVerifyAccountRoute(): void {
    // Add Route
    DeepLinking.addRoute(
      '/verify-email:params',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (response) => {
        const params = Utils.getURLParameters(this.url) as {Email: string, VerificationToken: string, ResetToken: string};
        const subdomain = this.getTenant();
        const tenant = await this.centralServerProvider.getTenant(subdomain);
        const email = params.Email;
        const token = params.VerificationToken;
        let resetToken = params.ResetToken;
        // Check params
        if (!email) {
          Message.showError(I18n.t('authentication.mandatoryEmail'));
          return;
        }
        // Get the Tenant
        if (!tenant) {
          Message.showError(I18n.t('authentication.unknownTenant'));
          return;
        }
        if (!token) {
          Message.showError(I18n.t('authentication.verifyAccountTokenNotValid'));
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
          //const result = await this.centralServerProvider.verifyEmail(subdomain, email, token);
          resetToken = 'qrgqrgqsdqwed23fvwre';
          const result = {status: Constants.REST_RESPONSE_SUCCESS}
          if (result.status === Constants.REST_RESPONSE_SUCCESS) {
            Message.showSuccess(I18n.t('authentication.accountVerifiedSuccess'));
            // Check if user has to change his password
            if (resetToken && resetToken !== 'null') {
              // Change password
              this.navigator.dispatch(
                CommonActions.navigate({
                  name: 'ResetPassword',
                  key: `${Utils.randomNumber()}`,
                  params: { tenantSubDomain: subdomain, hash: response.resetToken, email }
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
  }
}
