import I18n from 'i18n-js';
import { Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { NavigationActions, NavigationContainerComponent } from 'react-navigation';
import CentralServerProvider from '../provider/CentralServerProvider';
import Constants from '../utils/Constants';
import Message from '../utils/Message';
import Utils from '../utils/Utils';

export default class DeepLinkingManager {
  private navigator: NavigationContainerComponent;
  private centralServerProvider: CentralServerProvider;

  public static getInstance() {
    return new DeepLinkingManager();
  }

  public initialize(navigator: NavigationContainerComponent, centralServerProvider: CentralServerProvider) {
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
    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url);
      }
    }).catch((err) => {
      // tslint:disable-next-line: no-console
      console.error('An error occurred', err)
    });
  }

  private addResetPasswordRoute = () => {
    // Add Route
    DeepLinking.addRoute('/resetPassword/:tenant/:hash', (response: {tenant: string, hash: string}) => {
      // Check params
      if (!response.tenant) {
        Message.showError(I18n.t('authentication.mandatoryTenant'));
      }
      // Get the Tenant
      const tenant = this.centralServerProvider.getTenant(response.tenant);
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant'));
      }
      if (!response.hash) {
        Message.showError(I18n.t('authentication.resetPasswordHashNotValid'));
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      // Navigate
      this.navigator.dispatch(
        NavigationActions.navigate({
          routeName: 'ResetPassword',
          params: { tenant: response.tenant, hash: response.hash }
        })
      );
    });
  }

  private addVerifyAccountRoute = () => {
    // Add Route
    DeepLinking.addRoute('/verifyAccount/:tenant/:email/:token/:resetToken',
        async (response: {tenant: string, email: string, token: string, resetToken: string}) => {
      // Check params
      if (!response.tenant) {
        Message.showError(I18n.t('authentication.mandatoryTenant'));
      }
      if (!response.email) {
        Message.showError(I18n.t('authentication.mandatoryEmail'));
      }
      // Get the Tenant
      const tenant = this.centralServerProvider.getTenant(response.tenant);
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant'));
      }
      if (!response.token) {
        Message.showError(I18n.t('authentication.verifyAccountTokenNotValid'));
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      this.centralServerProvider.logoff();
      // Call the backend
      try {
        // Validate Account
        const result = await this.centralServerProvider.verifyEmail(response.tenant, response.email, response.token);
        if (result.status === Constants.REST_RESPONSE_SUCCESS) {
          // Ok
          Message.showSuccess(I18n.t('authentication.accountVerifiedSuccess'));
          // Check if user has to change his password
          if (response.resetToken) {
            // Change password
            this.navigator.dispatch(
              NavigationActions.navigate({
                routeName: 'ResetPassword',
                params: { tenant: response.tenant, hash: response.resetToken }
              })
            );
          } else {
            // Navigate to login page
            this.navigator.dispatch(
              NavigationActions.navigate({
                routeName: 'AuthNavigator',
                params: { tenant: response.tenant, email: response.email }
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
            case 530:
              Message.showError(I18n.t('authentication.accountAlreadyActive'));
              break;
            // VerificationToken no longer valid
            case 540:
              Message.showError(I18n.t('authentication.activationTokenNotValid'));
              break;
            // Email does not exist
            case 550:
              Message.showError(I18n.t('authentication.activationEmailNotValid'));
              break;
            // Other common Error
            default:
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error.request);
          }
        } else {
          Message.showError(I18n.t('general.unexpectedError'));
        }
      }
    });
  }

  public startListening() {
    Linking.addEventListener('url', this.handleUrl);
  }

  public stopListening() {
    Linking.removeEventListener('url', this.handleUrl);
  }

  public handleUrl = ({ url }: { url: string }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }
}
